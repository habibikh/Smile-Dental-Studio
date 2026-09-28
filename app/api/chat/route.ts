import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import {
  getBranches,
  getBranchById,
  getServices,
  getServiceById,
  getDoctors,
  getDoctorById,
  getAppointments,
  createAppointment,
  rescheduleAppointment,
  cancelAppointment
} from '@/lib/db';
import { calculateDoctorAvailability } from '@/lib/availability';

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Tool Declarations for Gemini
const getBranchesTool: FunctionDeclaration = {
  name: 'get_branches',
  description: 'Retrieve the list of all active Smile Dental clinic branch locations with addresses, phone numbers, and opening hours.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const getServicesTool: FunctionDeclaration = {
  name: 'get_services',
  description: 'Retrieve all available dental services, procedure descriptions, durations in minutes, and prices in USD.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const getDoctorsTool: FunctionDeclaration = {
  name: 'get_doctors',
  description: 'Retrieve active dentists, their specializations, qualifications, experience, and the branches where they practice.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      branchId: {
        type: Type.STRING,
        description: 'Optional branch ID to filter dentists who work at a specific clinic branch (e.g. "branch-downtown").',
      },
      serviceId: {
        type: Type.STRING,
        description: 'Optional service ID to filter dentists who perform a specific procedure (e.g. "srv-whitening").',
      },
    },
  },
};

const getDoctorAvailabilityTool: FunctionDeclaration = {
  name: 'get_doctor_availability',
  description: 'Calculate real available appointment time slots for a specific doctor, branch, service, and date.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      doctorId: {
        type: Type.STRING,
        description: 'The unique doctor ID (e.g. "dr-sarah-chen", "dr-ahmed-khan", "dr-elena-rodriguez").',
      },
      branchId: {
        type: Type.STRING,
        description: 'The clinic branch ID (e.g. "branch-downtown", "branch-westside").',
      },
      serviceId: {
        type: Type.STRING,
        description: 'The dental service ID (e.g. "srv-checkup-cleaning", "srv-whitening").',
      },
      date: {
        type: Type.STRING,
        description: 'The target appointment date in YYYY-MM-DD format.',
      },
    },
    required: ['doctorId', 'branchId', 'serviceId', 'date'],
  },
};

const getPatientAppointmentsTool: FunctionDeclaration = {
  name: 'get_patient_appointments',
  description: 'Retrieve the list of appointments for a patient using their email address.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      patientEmail: {
        type: Type.STRING,
        description: 'The email address of the patient.',
      },
    },
    required: ['patientEmail'],
  },
};

const bookAppointmentTool: FunctionDeclaration = {
  name: 'book_appointment',
  description: 'Book a confirmed dental appointment for a patient after checking availability.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      doctorId: { type: Type.STRING, description: 'ID of the chosen dentist' },
      branchId: { type: Type.STRING, description: 'ID of the clinic branch' },
      serviceId: { type: Type.STRING, description: 'ID of the dental service' },
      appointmentDate: { type: Type.STRING, description: 'Appointment date in YYYY-MM-DD format' },
      startTime: { type: Type.STRING, description: 'Start time slot (e.g. "10:00")' },
      patientName: { type: Type.STRING, description: 'Full name of the patient' },
      patientEmail: { type: Type.STRING, description: 'Email of the patient' },
      patientPhone: { type: Type.STRING, description: 'Phone number of the patient' },
      notes: { type: Type.STRING, description: 'Optional medical notes or symptom descriptions' },
    },
    required: ['doctorId', 'branchId', 'serviceId', 'appointmentDate', 'startTime', 'patientName', 'patientEmail', 'patientPhone'],
  },
};

const rescheduleAppointmentTool: FunctionDeclaration = {
  name: 'reschedule_appointment',
  description: 'Reschedule an existing dental appointment to a new date and time slot.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      appointmentId: { type: Type.STRING, description: 'The appointment ID or code' },
      newDate: { type: Type.STRING, description: 'The new appointment date in YYYY-MM-DD format' },
      newStartTime: { type: Type.STRING, description: 'The new start time (e.g. "14:30")' },
      patientEmail: { type: Type.STRING, description: 'The patient email address to verify authorization' },
      reason: { type: Type.STRING, description: 'Optional reason for rescheduling' },
    },
    required: ['appointmentId', 'newDate', 'newStartTime', 'patientEmail'],
  },
};

const cancelAppointmentTool: FunctionDeclaration = {
  name: 'cancel_appointment',
  description: 'Cancel an existing confirmed dental appointment.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      appointmentId: { type: Type.STRING, description: 'The appointment ID or code' },
      patientEmail: { type: Type.STRING, description: 'The patient email for authorization' },
      reason: { type: Type.STRING, description: 'Reason for cancellation' },
    },
    required: ['appointmentId'],
  },
};

// Tool Execution Dispatcher
async function executeTool(name: string, args: any): Promise<{ result: any; structuredCard?: any }> {
  switch (name) {
    case 'get_branches': {
      const branches = await getBranches();
      return {
        result: branches.map((b) => ({
          id: b.id,
          name: b.name,
          city: b.city,
          address: b.address,
          phone: b.phone,
          openingHours: b.openingHours,
        })),
      };
    }

    case 'get_services': {
      const services = await getServices();
      return {
        result: services.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          price: `$${s.price}`,
          duration: `${s.durationMinutes} mins`,
          shortDescription: s.shortDescription,
        })),
      };
    }

    case 'get_doctors': {
      const doctors = await getDoctors(args.branchId, args.serviceId);
      return {
        result: doctors.map((d) => ({
          id: d.id,
          name: d.name,
          title: d.title,
          specialization: d.specialization,
          qualification: d.qualification,
          experience: `${d.experienceYears} years`,
          rating: d.rating,
          languages: d.languages,
          branches: d.branchIds,
        })),
      };
    }

    case 'get_doctor_availability': {
      const avail = await calculateDoctorAvailability(
        args.doctorId,
        args.branchId,
        args.serviceId,
        args.date
      );

      const availableSlots = avail.slots.filter((s) => s.available).map((s) => s.time);
      return {
        result: {
          doctor: avail.doctorName,
          branch: avail.branchName,
          service: avail.serviceName,
          date: avail.date,
          isClosed: avail.isClosed,
          closureReason: avail.closureReason,
          availableSlotsCount: availableSlots.length,
          availableSlots: availableSlots.slice(0, 8),
        },
        structuredCard: {
          type: 'availability_slots',
          doctorId: args.doctorId,
          branchId: args.branchId,
          serviceId: args.serviceId,
          date: args.date,
          doctorName: avail.doctorName,
          branchName: avail.branchName,
          serviceName: avail.serviceName,
          slots: avail.slots.filter((s) => s.available),
        },
      };
    }

    case 'get_patient_appointments': {
      const apts = await getAppointments(args.patientEmail);
      return {
        result: apts.map((a) => ({
          code: a.appointmentCode,
          doctor: a.doctorName,
          service: a.serviceName,
          branch: a.branchName,
          date: a.appointmentDate,
          time: `${a.startTime} - ${a.endTime}`,
          status: a.status,
        })),
      };
    }

    case 'book_appointment': {
      try {
        const appointment = await createAppointment({
          doctorId: args.doctorId,
          branchId: args.branchId,
          serviceId: args.serviceId,
          appointmentDate: args.appointmentDate,
          startTime: args.startTime,
          patientName: args.patientName,
          patientEmail: args.patientEmail,
          patientPhone: args.patientPhone,
          notes: args.notes,
        });

        return {
          result: {
            success: true,
            appointmentCode: appointment.appointmentCode,
            doctorName: appointment.doctorName,
            branchName: appointment.branchName,
            serviceName: appointment.serviceName,
            date: appointment.appointmentDate,
            time: `${appointment.startTime} - ${appointment.endTime}`,
            status: appointment.status,
          },
          structuredCard: {
            type: 'booking_confirmed',
            appointmentCode: appointment.appointmentCode,
            doctorName: appointment.doctorName,
            branchName: appointment.branchName,
            serviceName: appointment.serviceName,
            date: appointment.appointmentDate,
            time: `${appointment.startTime} - ${appointment.endTime}`,
            patientName: appointment.patientName,
          },
        };
      } catch (err: any) {
        return {
          result: {
            success: false,
            error: err.message || 'Slot is no longer available.',
          },
        };
      }
    }

    case 'reschedule_appointment': {
      try {
        const updated = await rescheduleAppointment({
          appointmentId: args.appointmentId,
          newDate: args.newDate,
          newStartTime: args.newStartTime,
          patientEmail: args.patientEmail,
          reason: args.reason,
        });
        return {
          result: {
            success: true,
            appointmentCode: updated.appointmentCode,
            newDate: updated.appointmentDate,
            newTime: `${updated.startTime} - ${updated.endTime}`,
            message: 'Appointment successfully rescheduled.',
          },
        };
      } catch (err: any) {
        return {
          result: {
            success: false,
            error: err.message,
          },
        };
      }
    }

    case 'cancel_appointment': {
      try {
        const updated = await cancelAppointment(args.appointmentId, args.patientEmail, args.reason);
        return {
          result: {
            success: true,
            appointmentCode: updated.appointmentCode,
            status: 'cancelled',
            message: 'Appointment successfully cancelled.',
          },
        };
      } catch (err: any) {
        return {
          result: {
            success: false,
            error: err.message,
          },
        };
      }
    }

    default:
      return { result: { error: `Tool ${name} not found` } };
  }
}

function stripAsterisks(text: string): string {
  if (!text) return '';
  return text.replace(/\*/g, '');
}

/**
 * High-fidelity Intelligent Clinical Fallback Engine
 * Accurately answers questions with live database records, slots, and interactive cards without any asterisk signs.
 */
async function generateSmartClinicalResponse(query: string, userContext: any) {
  const q = (query || '').toLowerCase().trim();
  const branches = await getBranches();
  const services = await getServices();
  const doctors = await getDoctors();

  // 1. Services, Prices & Costs Inquiry
  if (
    q.includes('service') ||
    q.includes('price') ||
    q.includes('cost') ||
    q.includes('how much') ||
    q.includes('treatment') ||
    q.includes('clean') ||
    q.includes('whiten') ||
    q.includes('implant') ||
    q.includes('invisalign') ||
    q.includes('veneer') ||
    q.includes('root canal') ||
    q.includes('fee')
  ) {
    const list = services
      .slice(0, 6)
      .map(
        (s) =>
          `• ${s.name} (${s.category}): $${s.price} — ${s.shortDescription || s.description} (${s.durationMinutes} mins)`
      )
      .join('\n');

    return {
      text: `Here are our most popular clinical dental treatments with transparent pricing:\n\n${list}\n\nAll treatments include digital dental consultation, sterilized equipment, and follow-up guidance. Would you like to check available appointment slots with a specialist?`,
      structuredCards: [],
    };
  }

  // 2. Doctors & Specialists Inquiry
  if (
    q.includes('doctor') ||
    q.includes('specialist') ||
    q.includes('dentist') ||
    q.includes('who') ||
    q.includes('dr') ||
    q.includes('bio') ||
    q.includes('staff') ||
    q.includes('experience')
  ) {
    const list = doctors
      .slice(0, 4)
      .map(
        (d) =>
          `• ${d.name} — ${d.title} (${d.specialization}, ${d.experienceYears} yrs experience, Rating: ${d.rating}★)\n  Bio: ${d.bio}`
      )
      .join('\n\n');

    return {
      text: `Meet our certified dental specialists:\n\n${list}\n\nYou can book directly with any specialist or visit our Specialists page to view their full credentials.`,
      structuredCards: [],
    };
  }

  // 3. Branches, Studios, Locations & Hours
  if (
    q.includes('branch') ||
    q.includes('studio') ||
    q.includes('location') ||
    q.includes('where') ||
    q.includes('hours') ||
    q.includes('address') ||
    q.includes('phone') ||
    q.includes('contact') ||
    q.includes('clinic')
  ) {
    const list = branches
      .map(
        (b) =>
          `• ${b.name}\n  📍 ${b.address}, ${b.city}\n  📞 ${b.phone} | 🕒 ${b.openingHours}`
      )
      .join('\n\n');

    return {
      text: `We have 4 modern dental studios across the metropolitan area:\n\n${list}\n\nAll our studios feature digital 3D imaging, private suites, and validated free patient parking.`,
      structuredCards: [],
    };
  }

  // 4. Booking, Appointments & Availability Slots
  if (
    q.includes('book') ||
    q.includes('appointment') ||
    q.includes('availab') ||
    q.includes('slot') ||
    q.includes('time') ||
    q.includes('tomorrow') ||
    q.includes('schedule')
  ) {
    const defaultDoc = doctors[0];
    const defaultBranch = branches[0];
    const defaultService = services[0];
    const targetDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const avail = await calculateDoctorAvailability(
      defaultDoc?.id || 'dr-sarah-chen',
      defaultBranch?.id || 'branch-downtown',
      defaultService?.id || 'srv-checkup-cleaning',
      targetDate
    );

    const availableSlots = avail.slots.filter((s) => s.available);

    return {
      text: `I'd be delighted to assist you with booking! You can schedule directly online in just 2 minutes.\n\nHere are real-time available slots for ${defaultDoc?.name || 'Dr. Sarah Chen'} at ${defaultBranch?.name || 'Downtown Studio'} on ${targetDate}:`,
      structuredCards: [
        {
          type: 'availability_slots',
          doctorId: defaultDoc?.id,
          branchId: defaultBranch?.id,
          serviceId: defaultService?.id,
          date: targetDate,
          doctorName: defaultDoc?.name,
          branchName: defaultBranch?.name,
          serviceName: defaultService?.name,
          slots: availableSlots.slice(0, 6),
        },
      ],
    };
  }

  // 5. Emergency, Pain, Bleeding, Toothache
  if (
    q.includes('pain') ||
    q.includes('toothache') ||
    q.includes('hurt') ||
    q.includes('bleed') ||
    q.includes('broken') ||
    q.includes('emergency') ||
    q.includes('urgent') ||
    q.includes('swollen')
  ) {
    return {
      text: `🚨 Clinical Guidance for Dental Emergencies:\n\nIf you are experiencing acute dental pain or injury:\n1. Rinse gently with warm salt water (1/2 tsp salt in 8 oz water) to ease inflammation.\n2. Cold compress: Apply externally to your cheek for 15 minutes on / 15 minutes off to reduce swelling.\n3. Over-the-counter relief: Use ibuprofen or acetaminophen as directed on the label.\n4. Avoid extreme temperatures: Steer clear of very hot, cold, or acidic foods and drinks.\n\n⚠️ Urgent Action: Please schedule an urgent exam right away, or call our 24/7 Dental Emergency Hotline at (555) 234-CARE (2273).`,
      structuredCards: [],
    };
  }

  // 6. User's Own Bookings or Appointments
  if (q.includes('my visit') || q.includes('my appointment') || q.includes('reschedule') || q.includes('cancel')) {
    if (userContext?.email) {
      const userApts = await getAppointments(userContext.email);
      if (userApts.length > 0) {
        const aptList = userApts
          .map(
            (a) =>
              `• ${a.serviceName} with ${a.doctorName}\n  📅 ${a.appointmentDate} at ${a.startTime} | Status: ${a.status.toUpperCase()} (Code: ${a.appointmentCode})`
          )
          .join('\n\n');
        return {
          text: `Here are your current appointments on file for ${userContext.name || userContext.email}:\n\n${aptList}\n\nYou can also manage, reschedule, or cancel them directly from your Patient Dashboard!`,
          structuredCards: [],
        };
      }
    }
    return {
      text: `To view your scheduled visits, you can log in to your Patient Dashboard at any time. If you tell me your email address, I can also look up your appointment details directly!`,
      structuredCards: [],
    };
  }

  // Default Warm Welcome / Coordinator Overview
  const greetingName = userContext?.name ? ` ${userContext.name}` : '';
  return {
    text: `Hello${greetingName}! I am Smile Assistant, your dedicated clinical AI coordinator for Smile Dental.\n\nHow can I help you today? Here are a few things I can assist with:\n• 🦷 Explore Dental Treatments & Prices (e.g. Cleaning, Whitening, Invisalign)\n• 👨‍⚕️ View Specialist Profiles & Bio\n• 🏥 Clinic Studios, Addresses & Working Hours\n• 📅 Check Live Availability & Book an Appointment\n• 🚨 Urgent Advice for Dental Discomfort & Toothache\n\nFeel free to ask a question or pick an option below!`,
    structuredCards: [],
  };
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userContext } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // If Gemini client and API key are available, try Gemini with timeout
    if (ai && apiKey) {
      try {
        const systemInstruction = `You are Smile Assistant, the intelligent, friendly, and clinical AI dental coordinator for Smile Dental.
Today is ${new Date().toISOString().split('T')[0]}.

CRITICAL FORMATTING REQUIREMENT:
- DO NOT USE ANY ASTERISKS (*) ANYWHERE IN YOUR RESPONSES.
- NEVER use markdown bold (no **text**), italics (no *text*), or asterisk bullet points (no * bullet).
- Format all text cleanly with plain text, line breaks, emojis, and standard bullet points like • or numbers (1, 2, 3) without any asterisk symbols.

YOUR CAPABILITIES & RULES:
1. ALWAYS use the provided tools to fetch real clinic branches, services, doctors, real-time availability slots, and patient bookings.
2. NEVER invent doctor names, prices, clinic hours, or appointment availability.
3. For dental appointment requests:
   - Check real availability with \`get_doctor_availability\`.
   - Before calling \`book_appointment\`, make sure you have: Doctor, Service, Branch, Date, Time, Patient Name, Email, and Phone number.
4. Keep responses concise, warm, professional, and formatted with clean bullet points.`;

        const tools = [
          {
            functionDeclarations: [
              getBranchesTool,
              getServicesTool,
              getDoctorsTool,
              getDoctorAvailabilityTool,
              getPatientAppointmentsTool,
              bookAppointmentTool,
              rescheduleAppointmentTool,
              cancelAppointmentTool,
            ],
          },
        ];

        const conversationHistory = messages.slice(0, -1).map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content || '' }],
        }));

        const chat = ai.chats.create({
          model: 'gemini-3.8-flash',
          history: conversationHistory,
          config: {
            systemInstruction: userContext
              ? `${systemInstruction}\nCurrent User Context: Email=${userContext.email || 'None'}, Name=${userContext.name || 'Guest'}`
              : systemInstruction,
            tools,
          },
        });

        // Run chat with a 6-second timeout safety race
        const chatPromise = (async () => {
          let response = await chat.sendMessage({ message: lastUserMessage });
          let structuredCards: any[] = [];

          let iterations = 0;
          while (response.functionCalls && response.functionCalls.length > 0 && iterations < 4) {
            iterations++;
            const toolCall = response.functionCalls[0];
            const name = toolCall.name || '';
            const args = toolCall.args || {};

            if (!name) break;

            const { result, structuredCard } = await executeTool(name, args);
            if (structuredCard) {
              structuredCards.push(structuredCard);
            }

            response = await chat.sendMessage({
              message: [
                {
                  functionResponse: {
                    name,
                    response: result,
                  },
                },
              ],
            });
          }

          const finalText = response.text || 'I am ready to help you with your dental care!';
          return { text: stripAsterisks(finalText), structuredCards };
        })();

        const timeoutPromise = new Promise<{ text: string; structuredCards: any[] }>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini timeout')), 6500)
        );

        const result = await Promise.race([chatPromise, timeoutPromise]);
        return NextResponse.json({
          text: stripAsterisks(result.text),
          structuredCards: result.structuredCards,
        });
      } catch (geminiError: any) {
        console.warn('Gemini dynamic call fallback activated:', geminiError?.message || geminiError);
        const fallback = await generateSmartClinicalResponse(lastUserMessage, userContext);
        return NextResponse.json({
          text: stripAsterisks(fallback.text),
          structuredCards: fallback.structuredCards,
        });
      }
    }

    // Default intelligent clinical generator if no API key
    const fallback = await generateSmartClinicalResponse(lastUserMessage, userContext);
    return NextResponse.json({
      text: stripAsterisks(fallback.text),
      structuredCards: fallback.structuredCards,
    });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    const fallback = await generateSmartClinicalResponse('help', null);
    return NextResponse.json({
      text: stripAsterisks(fallback.text),
      structuredCards: fallback.structuredCards,
    });
  }
}
