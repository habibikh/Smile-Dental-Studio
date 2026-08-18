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
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

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
  description: 'Calculate real available appointment time slots for a specific doctor, branch, service, and date. Checks working schedules, breaks, and existing appointments.',
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
        description: 'The target appointment date in YYYY-MM-DD format (e.g. "2026-08-18"). Must not be in the past.',
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
  description: 'Book a confirmed dental appointment for a patient after double-checking slot availability.',
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
      appointmentId: { type: Type.STRING, description: 'The appointment ID or appointment code (e.g. "SD-8492")' },
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
      appointmentId: { type: Type.STRING, description: 'The appointment ID or code (e.g. "SD-8492")' },
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
          availableSlots: availableSlots.slice(0, 8), // Provide first 8 slots
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
            doctor: appointment.doctorName,
            service: appointment.serviceName,
            branch: appointment.branchName,
            date: appointment.appointmentDate,
            time: `${appointment.startTime} - ${appointment.endTime}`,
            status: appointment.status,
            message: 'Appointment successfully confirmed in database.',
          },
          structuredCard: {
            type: 'booking_confirmed',
            appointment,
          },
        };
      } catch (err: any) {
        return {
          result: {
            success: false,
            error: err.message || 'Booking failed validation.',
          },
        };
      }
    }

    case 'reschedule_appointment': {
      try {
        const rescheduled = await rescheduleAppointment({
          appointmentId: args.appointmentId,
          newDate: args.newDate,
          newStartTime: args.newStartTime,
          patientEmail: args.patientEmail,
          reason: args.reason,
        });

        return {
          result: {
            success: true,
            appointmentCode: rescheduled.appointmentCode,
            newDate: rescheduled.appointmentDate,
            newTime: `${rescheduled.startTime} - ${rescheduled.endTime}`,
            doctor: rescheduled.doctorName,
            status: rescheduled.status,
            message: 'Appointment successfully rescheduled.',
          },
        };
      } catch (err: any) {
        return {
          result: {
            success: false,
            error: err.message || 'Rescheduling failed validation.',
          },
        };
      }
    }

    case 'cancel_appointment': {
      try {
        const cancelled = await cancelAppointment(args.appointmentId, args.patientEmail, args.reason);
        return {
          result: {
            success: true,
            appointmentCode: cancelled.appointmentCode,
            status: 'cancelled',
            message: 'Appointment has been cancelled.',
          },
        };
      } catch (err: any) {
        return {
          result: {
            success: false,
            error: err.message || 'Cancellation failed.',
          },
        };
      }
    }

    default:
      return { result: { error: `Tool ${name} not found.` } };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userContext } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    const systemInstruction = `You are Smile Assistant, the intelligent, friendly, and clinical AI dental coordinator for Smile Dental.
Today is ${new Date().toISOString().split('T')[0]}.

YOUR CAPABILITIES & RULES:
1. ALWAYS use the provided tools to fetch real clinic branches, services, doctors, real-time availability slots, and patient bookings.
2. NEVER invent doctor names, prices, clinic hours, or appointment availability. If you do not know or the tool returns no slots, say so clearly.
3. For dental appointment requests:
   - Guide the patient warmly through selecting Branch, Service, Doctor, Date, and Time.
   - Check real availability with \`get_doctor_availability\`.
   - Before calling \`book_appointment\`, make sure you have: Doctor, Service, Branch, Date, Time, Patient Name, Email, and Phone number. Summarize the details and ask for their confirmation if not yet explicitly stated.
4. For clinical or medical inquiries (e.g. toothache, swollen gums, sensitivity):
   - Provide reassuring, evidence-based general dental information.
   - Clarify that you are an AI assistant and not a replacement for a formal clinical evaluation.
   - Encourage booking an exam or urgent dental consultation if experiencing acute pain, swelling, or trauma.
5. Keep responses concise, warm, professional, and formatted with clean bullet points.`;

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

    // Build the chat history for Gemini
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const conversationHistory = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    // Step 1: Initial call to Gemini
    const chat = ai.chats.create({
      model: 'gemini-3.7-flash',
      history: conversationHistory,
      config: {
        systemInstruction: userContext
          ? `${systemInstruction}\nCurrent User Context: Email=${userContext.email || 'None'}, Name=${userContext.name || 'Guest'}`
          : systemInstruction,
        tools,
      },
    });

    let response = await chat.sendMessage({ message: lastUserMessage });
    let structuredCards: any[] = [];

    // Step 2: Handle function calls if model requested any
    let iterations = 0;
    while (response.functionCalls && response.functionCalls.length > 0 && iterations < 5) {
      iterations++;
      const toolCall = response.functionCalls[0];
      const name = toolCall.name || '';
      const args = toolCall.args || {};

      if (!name) break;

      const { result, structuredCard } = await executeTool(name, args);
      if (structuredCard) {
        structuredCards.push(structuredCard);
      }

      // Send tool response back to Gemini to generate natural response
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

    const finalText = response.text || 'I am ready to help you with your dental appointments and questions!';

    return NextResponse.json({
      text: finalText,
      structuredCards,
    });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      {
        text: 'I apologize, I am temporarily having trouble connecting to the clinic booking system. Please try again or book directly via our online booking page.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
