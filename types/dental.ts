export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  active: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: 'General' | 'Cosmetic' | 'Restorative' | 'Orthodontics' | 'Pediatric' | 'Surgical';
  description: string;
  shortDescription: string;
  durationMinutes: number;
  price: number;
  imageUrl: string;
  iconName: string;
  benefits: string[];
  procedureSteps: string[];
  active: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  qualification: string;
  specialization: string;
  experienceYears: number;
  bio: string;
  imageUrl: string;
  branchIds: string[];
  serviceIds: string[];
  rating: number;
  reviewsCount: number;
  languages: string[];
  active: boolean;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  branchId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  breakStart: string; // "13:00"
  breakEnd: string; // "14:00"
  active: boolean;
}

export interface ClinicHoliday {
  id: string;
  branchId?: string; // If undefined, applies to all branches
  date: string; // YYYY-MM-DD
  reason: string;
}

export interface DoctorUnavailability {
  id: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  reason: string;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'
  | 'no-show';

export interface Appointment {
  id: string;
  appointmentCode: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  branchId: string;
  serviceId: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // "10:00"
  endTime: string; // "10:45"
  status: AppointmentStatus;
  notes?: string;
  cancelReason?: string;
  rescheduledFromId?: string;
  createdAt: string;
  updatedAt: string;
  // Hydrated helper fields
  doctorName?: string;
  doctorSpecialization?: string;
  doctorImage?: string;
  serviceName?: string;
  serviceDuration?: number;
  servicePrice?: number;
  branchName?: string;
  branchAddress?: string;
}

export interface PatientProfile {
  id: string;
  authUserId?: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  dentalInsurance?: string;
  medicalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  time: string; // "09:30"
  endTime: string; // "10:15"
  available: boolean;
  reason?: string;
  doctorId: string;
  branchId: string;
  date: string;
}

export interface AvailabilityQuery {
  doctorId: string;
  branchId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
}

export interface BookingPayload {
  doctorId: string;
  branchId: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  notes?: string;
}

export interface ReschedulePayload {
  appointmentId: string;
  newDate: string;
  newStartTime: string;
  patientEmail: string;
  reason?: string;
}

export interface DatabaseDataset {
  branches?: Branch[];
  services?: Service[];
  doctors?: Doctor[];
  schedules?: DoctorSchedule[];
  holidays?: ClinicHoliday[];
  unavailabilities?: DoctorUnavailability[];
  appointments?: Appointment[];
  patients?: PatientProfile[];
}

export interface AdminStats {
  totalDoctors: number;
  totalBranches: number;
  totalServices: number;
  totalAppointments: number;
  totalPatients: number;
  totalSchedules: number;
  upcomingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
}
