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
  email?: string;
  password?: string;
  phone?: string;
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
  role?: 'patient' | 'clinic_admin' | 'app_admin' | 'doctor';
  clinicId?: string; // Associated branch/clinic ID if clinic_admin
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

// Personal Assistant (Strictly 1 PA per Doctor)
export interface PersonalAssistant {
  id: string;
  doctorId: string;
  doctorName?: string;
  name: string;
  title: string; // e.g., "Certified Dental Assistant (CDA)", "Clinical PA"
  email: string;
  phone: string;
  password?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'on-leave';
  permissions: {
    canManageAppointments: boolean;
    canManageSchedules: boolean;
    canViewPatientNotes: boolean;
    canReschedule: boolean;
    canSendReminders: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Hospital Registration & Application Services Fee
export interface HospitalRegistration {
  id: string;
  hospitalName: string;
  licenseNumber: string;
  directorName: string;
  officialEmail: string;
  phone: string;
  city: string;
  address: string;
  suiteCount: number;
  registrationFeeAmount: number; // e.g. 499 (USD)
  feeCurrency: string; // "USD"
  feePaymentStatus: 'pending' | 'paid' | 'verified';
  paymentMethod: string; // "Credit Card" | "Bank Wire" | "Direct ACH"
  transactionId: string;
  paidAt: string;
  adminInviteToken: string;
  adminInviteTokenExpiresAt: string;
  adminInviteTokenUsed: boolean;
  adminCreatedEmail?: string;
  adminCreatedAt?: string;
  panelProvisioned?: boolean;
  panelProvisionedAt?: string;
  panelProvisionedBy?: string;
  branchId?: string;
  createdAt: string;
}

// Single-Use Admin Invite Token
export interface AdminInviteToken {
  token: string;
  hospitalId: string;
  hospitalName: string;
  officialEmail: string;
  directorName: string;
  expiresAt: string;
  used: boolean;
  usedAt?: string;
  createdAdminEmail?: string;
  createdAdminName?: string;
}

export interface AdminAccount {
  id: string;
  hospitalId: string;
  hospitalName: string;
  name: string;
  email: string;
  password?: string;
  role: 'primary_admin' | 'assistant_admin';
  phone?: string;
  createdAt: string;
}

export interface ClinicAdminAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  clinicId: string;
  clinicName?: string;
  role: 'clinic_admin';
  createdAt: string;
}
