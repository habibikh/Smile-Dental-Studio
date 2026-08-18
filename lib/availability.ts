import {
  getDoctorById,
  getBranchById,
  getServiceById,
  getDoctorSchedules,
  getClinicHolidays,
  getDoctorUnavailability,
  getAppointments
} from './db';
import { TimeSlot } from '@/types/dental';

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const mins = m % 60;
  return `${h.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export async function calculateDoctorAvailability(
  doctorId: string,
  branchId: string,
  serviceId: string,
  dateStr: string,
  excludeAppointmentId?: string
): Promise<{
  date: string;
  doctorName: string;
  branchName: string;
  serviceName: string;
  durationMinutes: number;
  isClosed: boolean;
  closureReason?: string;
  slots: TimeSlot[];
}> {
  const doctor = await getDoctorById(doctorId);
  const branch = await getBranchById(branchId);
  const service = await getServiceById(serviceId);

  if (!doctor || !branch || !service) {
    return {
      date: dateStr,
      doctorName: doctor?.name || 'Unknown',
      branchName: branch?.name || 'Unknown',
      serviceName: service?.name || 'Unknown',
      durationMinutes: 45,
      isClosed: true,
      closureReason: 'Invalid doctor, branch, or service selection.',
      slots: []
    };
  }

  const duration = service.durationMinutes || 45;
  const targetDate = new Date(`${dateStr}T00:00:00`);
  const todayStr = new Date().toISOString().split('T')[0];

  if (isNaN(targetDate.getTime()) || dateStr < todayStr) {
    return {
      date: dateStr,
      doctorName: doctor.name,
      branchName: branch.name,
      serviceName: service.name,
      durationMinutes: duration,
      isClosed: true,
      closureReason: dateStr < todayStr ? 'Selected date is in the past.' : 'Invalid date format.',
      slots: []
    };
  }

  // 1. Holiday Check
  const holidays = await getClinicHolidays(branchId, dateStr);
  if (holidays.length > 0) {
    return {
      date: dateStr,
      doctorName: doctor.name,
      branchName: branch.name,
      serviceName: service.name,
      durationMinutes: duration,
      isClosed: true,
      closureReason: `Clinic closed for holiday: ${holidays[0].reason}`,
      slots: []
    };
  }

  // 2. Doctor Unavailability Check
  const leaves = await getDoctorUnavailability(doctorId, dateStr);
  if (leaves.length > 0 && !leaves[0].startTime) {
    return {
      date: dateStr,
      doctorName: doctor.name,
      branchName: branch.name,
      serviceName: service.name,
      durationMinutes: duration,
      isClosed: true,
      closureReason: `Doctor unavailable: ${leaves[0].reason}`,
      slots: []
    };
  }

  // 3. Day of week schedule
  const dayOfWeek = targetDate.getDay();
  const schedules = await getDoctorSchedules(doctorId, branchId);
  const daySchedule = schedules.find((s) => s.dayOfWeek === dayOfWeek && s.active);

  if (!daySchedule) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      date: dateStr,
      doctorName: doctor.name,
      branchName: branch.name,
      serviceName: service.name,
      durationMinutes: duration,
      isClosed: true,
      closureReason: `${doctor.name} does not practice at ${branch.name} on ${days[dayOfWeek]}s.`,
      slots: []
    };
  }

  // 4. Retrieve existing appointments for this doctor on this date
  const allAppointments = await getAppointments();
  const dayAppointments = allAppointments.filter(
    (a) => a.doctorId === doctorId && a.appointmentDate === dateStr && a.status !== 'cancelled' && a.id !== excludeAppointmentId
  );

  const startMin = timeToMinutes(daySchedule.startTime);
  const endMin = timeToMinutes(daySchedule.endTime);
  const breakStartMin = timeToMinutes(daySchedule.breakStart);
  const breakEndMin = timeToMinutes(daySchedule.breakEnd);

  // Generate slots on fixed 30-minute stepping grid
  const stepMinutes = 30;
  const slots: TimeSlot[] = [];

  for (let current = startMin; current + duration <= endMin; current += stepMinutes) {
    const slotEnd = current + duration;
    const timeStr = minutesToTime(current);
    const endTimeStr = minutesToTime(slotEnd);

    // Overlap with break?
    const overlapsBreak = !(slotEnd <= breakStartMin || current >= breakEndMin);
    if (overlapsBreak) {
      slots.push({
        time: timeStr,
        endTime: endTimeStr,
        available: false,
        reason: 'Staff Lunch Break (1:00 PM - 2:00 PM)',
        doctorId,
        branchId,
        date: dateStr
      });
      continue;
    }

    // Overlap with existing appointment?
    const conflict = dayAppointments.find((apt) => {
      const aptStart = timeToMinutes(apt.startTime);
      const aptEnd = timeToMinutes(apt.endTime);
      return current < aptEnd && slotEnd > aptStart;
    });

    if (conflict) {
      slots.push({
        time: timeStr,
        endTime: endTimeStr,
        available: false,
        reason: 'Already Booked',
        doctorId,
        branchId,
        date: dateStr
      });
      continue;
    }

    // Available!
    slots.push({
      time: timeStr,
      endTime: endTimeStr,
      available: true,
      doctorId,
      branchId,
      date: dateStr
    });
  }

  return {
    date: dateStr,
    doctorName: doctor.name,
    branchName: branch.name,
    serviceName: service.name,
    durationMinutes: duration,
    isClosed: false,
    slots
  };
}
