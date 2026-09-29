import {
  Branch,
  Service,
  Doctor,
  DoctorSchedule,
  ClinicHoliday,
  DoctorUnavailability,
  Appointment,
  AppointmentStatus,
  PatientProfile,
  BookingPayload,
  ReschedulePayload,
  PersonalAssistant,
  HospitalRegistration,
  AdminInviteToken,
  AdminAccount,
  ClinicAdminAccount
} from '@/types/dental';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

// Default initial dataset
const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'branch-downtown',
    name: 'Smile Dental - Downtown Metro',
    city: 'Downtown',
    address: '104 Grand Avenue, Suite 300, Metro City',
    phone: '(555) 234-5678',
    email: 'downtown@smiledental.com',
    openingHours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    description: 'Our flagship contemporary dental center with 3D intraoral scanners, private suites, and digital smile preview lounges.',
    imageUrl: 'https://picsum.photos/seed/dentalbranch1/800/600',
    rating: 4.9,
    reviewsCount: 218,
    active: true,
  },
  {
    id: 'branch-westside',
    name: 'Smile Dental - Westside Plaza',
    city: 'Westside',
    address: '720 Sunset Boulevard, Building B, Metro City',
    phone: '(555) 345-6789',
    email: 'westside@smiledental.com',
    openingHours: 'Mon - Fri: 8:30 AM - 6:00 PM, Sat: 9:00 AM - 3:00 PM',
    description: 'Specializing in orthodontics, clear aligners, and aesthetic restorations with a gentle pediatric dentistry wing.',
    imageUrl: 'https://picsum.photos/seed/dentalbranch2/800/600',
    rating: 4.8,
    reviewsCount: 164,
    active: true,
  },
  {
    id: 'branch-northshore',
    name: 'Smile Dental - Northshore Medical Center',
    city: 'Northshore',
    address: '450 Harbor View Way, Medical Tower 2, Metro City',
    phone: '(555) 456-7890',
    email: 'northshore@smiledental.com',
    openingHours: 'Mon - Fri: 8:00 AM - 7:00 PM, Sun: 10:00 AM - 4:00 PM',
    description: 'Advanced implantology and oral surgery surgical center featuring sedation suites and laser periodontal therapy.',
    imageUrl: 'https://picsum.photos/seed/dentalbranch3/800/600',
    rating: 4.9,
    reviewsCount: 142,
    active: true,
  },
  {
    id: 'branch-uptown',
    name: 'Smile Dental - Uptown Family Care',
    city: 'Uptown',
    address: '88 Parkwood Lane, Suite 102, Metro City',
    phone: '(555) 567-8901',
    email: 'uptown@smiledental.com',
    openingHours: 'Mon - Sat: 9:00 AM - 5:00 PM',
    description: 'Cozy, family-friendly neighborhood practice focused on anxiety-free preventive dentistry and dental hygiene.',
    imageUrl: 'https://picsum.photos/seed/dentalbranch4/800/600',
    rating: 4.9,
    reviewsCount: 195,
    active: true,
  }
];

const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-checkup-cleaning',
    name: 'Comprehensive Dental Checkup & Hygiene',
    category: 'General',
    description: 'Thorough oral exam, ultrasonic calculus removal, airflow stain polish, digital X-rays, and customized gum health index evaluation.',
    shortDescription: 'Complete oral evaluation with ultrasonic polish & digital imaging.',
    durationMinutes: 45,
    price: 120.00,
    imageUrl: 'https://picsum.photos/seed/cleaningdent/800/600',
    iconName: 'Sparkles',
    benefits: ['Prevents periodontal disease', 'Removes deep plaque & tartar', 'Early cavity detection', 'Freshens breath instantly'],
    procedureSteps: ['Comprehensive visual examination', 'Low-radiation digital bitewing X-rays', 'Ultrasonic gentle scaler treatment', 'Micro-air polish & fluoride shield'],
    active: true
  },
  {
    id: 'srv-whitening',
    name: 'Laser In-Clinic Teeth Whitening',
    category: 'Cosmetic',
    description: 'Professional medical-grade hydrogen peroxide gel activated by LED laser wavelength for up to 8 shades whiter teeth in one session.',
    shortDescription: 'Transform your smile up to 8 shades brighter in under 60 minutes.',
    durationMinutes: 60,
    price: 299.00,
    imageUrl: 'https://picsum.photos/seed/whiteteeth/800/600',
    iconName: 'Sun',
    benefits: ['Immediate dramatic results', 'Enamel-safe desensitizing formulation', 'Long-lasting brightness', 'Customized take-home maintenance trays included'],
    procedureSteps: ['Shade assessment and clinical prep', 'Gingival barrier application for safety', '3x 15-minute active laser illumination cycles', 'Anti-sensitivity mineralizing finish'],
    active: true
  },
  {
    id: 'srv-invisalign',
    name: 'Clear Aligners & Orthodontic Consultation',
    category: 'Orthodontics',
    description: '3D iTero digital smile scanning with computerized orthodontic outcome simulation and personalized clear aligner treatment roadmap.',
    shortDescription: 'Discreet orthodontic correction tailored to your dental arches.',
    durationMinutes: 45,
    price: 150.00,
    imageUrl: 'https://picsum.photos/seed/invisalignortho/800/600',
    iconName: 'Smile',
    benefits: ['Nearly invisible clear aligners', 'No dietary restrictions', 'Predictable digital 3D staging', 'Fewer in-person checkups needed'],
    procedureSteps: ['3D high-resolution digital scanning', 'AI-assisted orthodontic alignment simulation', 'ClinCheck treatment plan review', 'Custom aligner fabrication dispatch'],
    active: true
  },
  {
    id: 'srv-dental-implant',
    name: 'Dental Implant Consultation & Surgical Plan',
    category: 'Restorative',
    description: 'Titanium root replacement and 3D CBCT bone density scan for permanent single-tooth or full-arch natural tooth replacement.',
    shortDescription: 'Permanent, lifelike replacement for missing teeth.',
    durationMinutes: 60,
    price: 250.00,
    imageUrl: 'https://picsum.photos/seed/implantdent/800/600',
    iconName: 'Shield',
    benefits: ['Preserves natural jawbone volume', 'Functions like real natural teeth', 'Lifetime durability with proper care', 'Restores confident chewing & speech'],
    procedureSteps: ['3D CBCT volume tomography scan', 'Bone volume and nerve mapping', 'Computer-guided implant fixture planning', 'Custom crown material selection'],
    active: true
  },
  {
    id: 'srv-root-canal',
    name: 'Endodontic Micro-Root Canal Treatment',
    category: 'Restorative',
    description: 'Microscope-assisted gentle root canal therapy removing infected pulp, sealing canals, and instantly relieving acute toothache.',
    shortDescription: 'Pain-free microscopic therapy to rescue infected teeth.',
    durationMinutes: 75,
    price: 450.00,
    imageUrl: 'https://picsum.photos/seed/rootcanal/800/600',
    iconName: 'Activity',
    benefits: ['Instant acute pain relief', 'Saves natural tooth from extraction', 'Microscope precision canal disinfection', 'Bio-ceramic hermetic sealing'],
    procedureSteps: ['Profound computerized local anesthesia', 'Rubber dam isolation & microscope access', 'Rotary bio-mechanical canal cleaning', 'Hermetic gutta-percha seal & core build'],
    active: true
  },
  {
    id: 'srv-pediatric-care',
    name: 'Pediatric Gentle Dental Exam & Sealant',
    category: 'Pediatric',
    description: 'Fun, fear-free dentistry for children with cavity-fighting molar sealants, gentle cleaning, and positive oral habits coaching.',
    shortDescription: 'Compassionate, tear-free preventive care for bright young smiles.',
    durationMinutes: 40,
    price: 95.00,
    imageUrl: 'https://picsum.photos/seed/pediatricdent/800/600',
    iconName: 'Heart',
    benefits: ['Builds lifelong positive dental trust', 'Protects deep fissures against caries', 'Gentle, non-intimidating approach', 'Kids prize & certificate included'],
    procedureSteps: ['Friendly welcoming introduction', 'Count & shine gentle tooth check', 'BPA-free protective molar sealant coat', 'Topical strawberry fluoridation'],
    active: true
  }
];

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'dr-sarah-chen',
    name: 'Dr. Sarah Chen, DDS',
    email: 'dr.sarah.chen@smiledental.com',
    password: 'doctor123',
    phone: '(555) 234-1101',
    title: 'Lead Cosmetic & Restorative Dentist',
    qualification: 'DDS (Columbia University), AACD Accredited Fellow',
    specialization: 'Cosmetic & Aesthetic Dentistry',
    experienceYears: 14,
    bio: 'Dr. Sarah Chen is an internationally recognized aesthetic dentist passionate about minimally invasive smile makeovers, porcelain veneers, and laser teeth whitening with over 14 years of clinical experience.',
    imageUrl: 'https://picsum.photos/seed/drsarahchen/800/800',
    branchIds: ['branch-downtown', 'branch-westside'],
    serviceIds: ['srv-checkup-cleaning', 'srv-whitening', 'srv-invisalign'],
    rating: 4.9,
    reviewsCount: 142,
    languages: ['English', 'Mandarin'],
    active: true
  },
  {
    id: 'dr-ahmed-khan',
    name: 'Dr. Ahmed Khan, DMD, MS',
    email: 'dr.ahmed.khan@smiledental.com',
    password: 'doctor123',
    phone: '(555) 234-1102',
    title: 'Senior Orthodontist & Aligner Specialist',
    qualification: 'DMD (Harvard School of Dental Medicine), MS Orthodontics',
    specialization: 'Orthodontics & Clear Aligners',
    experienceYears: 12,
    bio: 'Dr. Ahmed Khan has transformed over 2,500 smiles with personalized clear aligner therapy, rapid orthodontics, and comprehensive bite rehabilitation for teens and adults.',
    imageUrl: 'https://picsum.photos/seed/drahmedkhan/800/800',
    branchIds: ['branch-downtown', 'branch-westside', 'branch-uptown'],
    serviceIds: ['srv-invisalign', 'srv-checkup-cleaning'],
    rating: 4.9,
    reviewsCount: 118,
    languages: ['English', 'Arabic', 'Urdu'],
    active: true
  },
  {
    id: 'dr-elena-rodriguez',
    name: 'Dr. Elena Rodriguez, DDS',
    email: 'dr.elena.rodriguez@smiledental.com',
    password: 'doctor123',
    phone: '(555) 234-1103',
    title: 'Director of Implantology & Oral Surgery',
    qualification: 'DDS (UCSF Dental), ICOI Diplomate in Implantology',
    specialization: 'Dental Implants & Oral Surgery',
    experienceYears: 16,
    bio: 'Specializing in computer-guided 3D dental implants, bone regeneration, and gentle surgical extractions with state-of-the-art sedation protocols and maximum patient comfort.',
    imageUrl: 'https://picsum.photos/seed/drelena/800/800',
    rating: 5.0,
    reviewsCount: 160,
    languages: ['English', 'Spanish'],
    branchIds: ['branch-northshore', 'branch-downtown'],
    serviceIds: ['srv-dental-implant'],
    active: true
  },
  {
    id: 'dr-emily-watson',
    name: 'Dr. Emily Watson, DMD',
    email: 'dr.emily.watson@smiledental.com',
    password: 'doctor123',
    phone: '(555) 234-1105',
    title: 'Pediatric & Family Dentist',
    qualification: 'DMD (University of Pennsylvania), Board Certified Pediatric Dentist',
    specialization: 'Pediatric & Preventive Dentistry',
    experienceYears: 9,
    bio: 'Dr. Emily Watson creates a joyful, warm environment where children and families feel completely relaxed and excited about caring for their dental health.',
    imageUrl: 'https://picsum.photos/seed/dremily/800/800',
    rating: 4.9,
    reviewsCount: 134,
    languages: ['English', 'French'],
    branchIds: ['branch-uptown', 'branch-westside'],
    serviceIds: ['srv-pediatric-care', 'srv-checkup-cleaning', 'srv-whitening'],
    active: true
  }
];

const INITIAL_SCHEDULES: DoctorSchedule[] = [
  { id: 'sch-1', doctorId: 'dr-sarah-chen', branchId: 'branch-downtown', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-2', doctorId: 'dr-sarah-chen', branchId: 'branch-downtown', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-3', doctorId: 'dr-sarah-chen', branchId: 'branch-westside', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-4', doctorId: 'dr-ahmed-khan', branchId: 'branch-downtown', dayOfWeek: 1, startTime: '08:30', endTime: '16:30', breakStart: '12:30', breakEnd: '13:30', active: true },
  { id: 'sch-5', doctorId: 'dr-ahmed-khan', branchId: 'branch-westside', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-6', doctorId: 'dr-elena-rodriguez', branchId: 'branch-northshore', dayOfWeek: 1, startTime: '08:30', endTime: '17:30', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-7', doctorId: 'dr-emily-watson', branchId: 'branch-uptown', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
];

const INITIAL_HOLIDAYS: ClinicHoliday[] = [
  { id: 'hol-1', date: '2026-09-07', reason: 'Labor Day Public Holiday' },
  { id: 'hol-2', date: '2026-11-26', reason: 'Thanksgiving Clinic Closure' },
  { id: 'hol-3', date: '2026-12-25', reason: 'Christmas Day Closure' }
];

const INITIAL_PATIENTS: PatientProfile[] = [
  {
    id: 'pat-alex-morgan',
    fullName: 'Alex Morgan',
    email: 'patient@example.com',
    phone: '(555) 890-1234',
    dateOfBirth: '1992-05-14',
    gender: 'Female',
    address: '428 River Oaks Blvd, Metro City',
    dentalInsurance: 'Delta Dental Premier (ID #8492019)',
    medicalNotes: 'Mild sensitivity to cold drinks on lower right quadrant.',
    createdAt: '2026-01-05T10:30:00.000Z',
    updatedAt: '2026-01-05T10:30:00.000Z',
  },
  {
    id: 'pat-habib-ullah',
    fullName: 'Habib Ullah',
    email: 'habibullah5997@gmail.com',
    phone: '(555) 777-8899',
    dateOfBirth: '1997-06-18',
    gender: 'Male',
    address: '304 Downtown Plaza, Metro City',
    dentalInsurance: 'BlueCross BlueShield Dental (ID #BC-7729)',
    medicalNotes: 'Regular preventative hygiene and smile aesthetic checkups.',
    createdAt: '2026-02-14T08:00:00.000Z',
    updatedAt: '2026-02-14T08:00:00.000Z',
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-seed-1',
    appointmentCode: 'SD-8492',
    patientId: 'pat-alex-morgan',
    patientName: 'Alex Morgan',
    patientEmail: 'patient@example.com',
    patientPhone: '(555) 890-1234',
    doctorId: 'dr-sarah-chen',
    branchId: 'branch-downtown',
    serviceId: 'srv-checkup-cleaning',
    appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '10:45',
    status: 'confirmed',
    notes: 'Routine 6-month checkup and tartar polish.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const INITIAL_CLINIC_ADMINS: ClinicAdminAccount[] = [
  {
    id: 'clinic-adm-doctor-1',
    name: 'Dr. Elena Rostova',
    email: 'doctor@smiledental.com',
    password: 'smile1234',
    phone: '(555) 234-1100',
    clinicId: 'branch-downtown',
    clinicName: 'Smile Dental - Downtown Metro',
    role: 'clinic_admin',
    createdAt: '2026-01-10T14:30:00.000Z',
  }
];

const INITIAL_ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id: 'adm-primary-1',
    hospitalId: 'hosp-metro-smile',
    hospitalName: 'Metro Smile Dental Hospital & Surgical Pavilion',
    name: 'Hospital System Administrator',
    email: 'admin@smiledental.com',
    password: 'smile1234',
    role: 'primary_admin',
    phone: '(555) 234-5000',
    createdAt: '2026-01-10T14:30:00.000Z',
  }
];

// Persistent local memory store for fast sync caching
declare global {
  var __smileDentalStore: {
    branches: Branch[];
    services: Service[];
    doctors: Doctor[];
    schedules: DoctorSchedule[];
    holidays: ClinicHoliday[];
    unavailabilities: DoctorUnavailability[];
    appointments: Appointment[];
    patients: Map<string, PatientProfile>;
    personalAssistants: PersonalAssistant[];
    hospitalRegistrations: HospitalRegistration[];
    adminInviteTokens: AdminInviteToken[];
    adminAccounts: AdminAccount[];
    clinicAdmins: ClinicAdminAccount[];
    initializedFirestore: boolean;
  } | undefined;
}

function initPatientsMap(): Map<string, PatientProfile> {
  const map = new Map<string, PatientProfile>();
  INITIAL_PATIENTS.forEach((p) => map.set(p.email.toLowerCase(), { ...p }));
  return map;
}

function getStore() {
  if (!global.__smileDentalStore) {
    global.__smileDentalStore = {
      branches: [...INITIAL_BRANCHES],
      services: [...INITIAL_SERVICES],
      doctors: [...INITIAL_DOCTORS],
      schedules: [...INITIAL_SCHEDULES],
      holidays: [...INITIAL_HOLIDAYS],
      unavailabilities: [],
      appointments: [...INITIAL_APPOINTMENTS],
      patients: initPatientsMap(),
      personalAssistants: [],
      hospitalRegistrations: [],
      adminInviteTokens: [],
      adminAccounts: [...INITIAL_ADMIN_ACCOUNTS],
      clinicAdmins: [...INITIAL_CLINIC_ADMINS],
      initializedFirestore: false,
    };
  }
  return global.__smileDentalStore;
}

let isInitializingFirestore = false;

/**
 * Sync Firestore into memory, and seed initial dataset if Firestore is empty
 */
async function ensureFirestoreInitialized(): Promise<void> {
  const store = getStore();
  if (store.initializedFirestore || isInitializingFirestore) return;
  isInitializingFirestore = true;

  try {
    // Check if branches exist in Firestore
    const branchesSnap = await getDocs(collection(db, 'branches'));
    if (!branchesSnap.empty) {
      // Load Firestore branches
      const loadedBranches: Branch[] = [];
      branchesSnap.forEach((docSnap) => loadedBranches.push(docSnap.data() as Branch));
      store.branches = loadedBranches;

      // Load Firestore doctors
      const doctorsSnap = await getDocs(collection(db, 'doctors'));
      if (!doctorsSnap.empty) {
        const loadedDocs: Doctor[] = [];
        doctorsSnap.forEach((docSnap) => loadedDocs.push(docSnap.data() as Doctor));
        store.doctors = loadedDocs;
      }

      // Load Firestore clinicAdmins
      const clinicAdminsSnap = await getDocs(collection(db, 'clinicAdmins'));
      if (!clinicAdminsSnap.empty) {
        const loadedAdmins: ClinicAdminAccount[] = [];
        clinicAdminsSnap.forEach((docSnap) => loadedAdmins.push(docSnap.data() as ClinicAdminAccount));
        store.clinicAdmins = loadedAdmins;
      }

      // Load Firestore services
      const servicesSnap = await getDocs(collection(db, 'services'));
      if (!servicesSnap.empty) {
        const loadedServices: Service[] = [];
        servicesSnap.forEach((docSnap) => loadedServices.push(docSnap.data() as Service));
        store.services = loadedServices;
      }

      // Load appointments
      const appointmentsSnap = await getDocs(collection(db, 'appointments'));
      if (!appointmentsSnap.empty) {
        const loadedApts: Appointment[] = [];
        appointmentsSnap.forEach((docSnap) => loadedApts.push(docSnap.data() as Appointment));
        store.appointments = loadedApts;
      }

      // Load patients
      const patientsSnap = await getDocs(collection(db, 'patients'));
      if (!patientsSnap.empty) {
        patientsSnap.forEach((docSnap) => {
          const pat = docSnap.data() as PatientProfile;
          if (pat.email) store.patients.set(pat.email.toLowerCase(), pat);
        });
      }

      store.initializedFirestore = true;
      return;
    }

    // Seeding Firestore for the first time
    console.log('Seeding initial clinical data to Firebase Firestore...');

    // Seed branches
    for (const b of INITIAL_BRANCHES) {
      await setDoc(doc(db, 'branches', b.id), b);
    }
    // Seed services
    for (const s of INITIAL_SERVICES) {
      await setDoc(doc(db, 'services', s.id), s);
    }
    // Seed doctors
    for (const d of INITIAL_DOCTORS) {
      await setDoc(doc(db, 'doctors', d.id), d);
    }
    // Seed schedules
    for (const sc of INITIAL_SCHEDULES) {
      await setDoc(doc(db, 'schedules', sc.id), sc);
    }
    // Seed clinic admins
    for (const ca of INITIAL_CLINIC_ADMINS) {
      await setDoc(doc(db, 'clinicAdmins', ca.id), ca);
    }
    // Seed admin accounts
    for (const a of INITIAL_ADMIN_ACCOUNTS) {
      await setDoc(doc(db, 'adminAccounts', a.id), a);
    }
    // Seed patients
    for (const p of INITIAL_PATIENTS) {
      await setDoc(doc(db, 'patients', p.id), p);
    }
    // Seed appointments
    for (const apt of INITIAL_APPOINTMENTS) {
      await setDoc(doc(db, 'appointments', apt.id), apt);
    }

    store.initializedFirestore = true;
    console.log('Firebase Firestore successfully initialized with clinical dataset.');
  } catch (error) {
    console.warn('Firestore initialization notice (operating in hybrid cache mode):', error);
  } finally {
    isInitializingFirestore = false;
  }
}

// Trigger initialization on module load
ensureFirestoreInitialized().catch(() => {});

// =========================================================================
// BRANCHES / CLINICS
// =========================================================================

export async function getBranches(): Promise<Branch[]> {
  await ensureFirestoreInitialized();
  try {
    const snap = await getDocs(collection(db, 'branches'));
    if (!snap.empty) {
      const list: Branch[] = [];
      snap.forEach((d) => {
        const b = d.data() as Branch;
        if (b.active !== false) list.push(b);
      });
      const store = getStore();
      store.branches = list;
    }
  } catch (err) {
    console.warn('Firestore getBranches error:', err);
  }
  const store = getStore();
  return store.branches.filter((b) => b.active !== false);
}

export async function getBranchById(id: string): Promise<Branch | null> {
  await ensureFirestoreInitialized();
  try {
    const snap = await getDoc(doc(db, 'branches', id));
    if (snap.exists()) {
      return snap.data() as Branch;
    }
  } catch (err) {
    console.warn('Firestore getBranchById error:', err);
  }
  const store = getStore();
  return store.branches.find((b) => b.id === id && b.active !== false) || null;
}

export async function saveBranch(data: Partial<Branch> & { name: string }): Promise<Branch> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const id = data.id || `branch-${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
  const existingIndex = data.id ? store.branches.findIndex((b) => b.id === data.id) : -1;

  const updatedBranch: Branch = {
    id: existingIndex >= 0 ? store.branches[existingIndex].id : id,
    name: (data.name || 'Smile Dental Studio').trim(),
    city: (data.city || 'Metro City').trim(),
    address: (data.address || 'Central Clinical Blvd, Suite 100').trim(),
    phone: (data.phone || '(555) 234-5678').trim(),
    email: (data.email || 'clinic@smiledental.com').trim(),
    openingHours: (data.openingHours || 'Mon - Fri: 8:00 AM - 6:00 PM | Sat: 9:00 AM - 3:00 PM').trim(),
    description: (data.description || 'Specialized dental clinic facility with state-of-the-art operatories.').trim(),
    imageUrl: data.imageUrl?.trim() || `https://picsum.photos/seed/${id}/800/600`,
    rating: data.rating !== undefined ? Number(data.rating) : 4.9,
    reviewsCount: data.reviewsCount !== undefined ? Number(data.reviewsCount) : 100,
    active: data.active !== undefined ? data.active : true,
  };

  // 1. Write to Firestore
  try {
    await setDoc(doc(db, 'branches', updatedBranch.id), updatedBranch);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `branches/${updatedBranch.id}`);
  }

  // 2. Update local store
  if (existingIndex >= 0) {
    store.branches[existingIndex] = updatedBranch;
  } else {
    store.branches.push(updatedBranch);
  }
  return updatedBranch;
}

export async function deleteBranch(id: string): Promise<boolean> {
  await ensureFirestoreInitialized();
  const store = getStore();

  // 1. Delete from Firestore
  try {
    await deleteDoc(doc(db, 'branches', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `branches/${id}`);
  }

  // 2. Update local store
  const init = store.branches.length;
  store.branches = store.branches.filter((b) => b.id !== id);

  // Reassign any doctor whose only assigned branch was this deleted branch to another active branch
  const remainingBranch = store.branches[0]?.id;
  if (remainingBranch) {
    for (const docObj of store.doctors) {
      if (docObj.branchIds?.includes(id)) {
        docObj.branchIds = docObj.branchIds.filter((bId) => bId !== id);
        if (docObj.branchIds.length === 0) {
          docObj.branchIds = [remainingBranch];
        }
        try {
          await setDoc(doc(db, 'doctors', docObj.id), docObj);
        } catch {
          // ignore
        }
      }
    }
  }

  return store.branches.length < init;
}

// =========================================================================
// SERVICES
// =========================================================================

export async function getServices(): Promise<Service[]> {
  await ensureFirestoreInitialized();
  try {
    const snap = await getDocs(collection(db, 'services'));
    if (!snap.empty) {
      const list: Service[] = [];
      snap.forEach((d) => {
        const s = d.data() as Service;
        if (s.active !== false) list.push(s);
      });
      const store = getStore();
      store.services = list;
    }
  } catch (err) {
    console.warn('Firestore getServices error:', err);
  }
  const store = getStore();
  return store.services.filter((s) => s.active !== false);
}

export async function getServiceById(id: string): Promise<Service | null> {
  await ensureFirestoreInitialized();
  const store = getStore();
  return store.services.find((s) => s.id === id && s.active !== false) || null;
}

// =========================================================================
// DOCTORS
// =========================================================================

export async function getDoctors(branchId?: string, serviceId?: string): Promise<Doctor[]> {
  await ensureFirestoreInitialized();
  try {
    const snap = await getDocs(collection(db, 'doctors'));
    if (!snap.empty) {
      const list: Doctor[] = [];
      snap.forEach((d) => {
        const docData = d.data() as Doctor;
        if (docData.active !== false) list.push(docData);
      });
      const store = getStore();
      store.doctors = list;
    }
  } catch (err) {
    console.warn('Firestore getDoctors error:', err);
  }
  const store = getStore();
  let doctors = store.doctors.filter((d) => d.active !== false);

  if (branchId && branchId !== 'all') {
    doctors = doctors.filter((d) => d.branchIds?.includes(branchId));
  }
  if (serviceId) {
    doctors = doctors.filter((d) => d.serviceIds?.includes(serviceId));
  }

  return doctors;
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  await ensureFirestoreInitialized();
  try {
    const snap = await getDoc(doc(db, 'doctors', id));
    if (snap.exists()) {
      return snap.data() as Doctor;
    }
  } catch (err) {
    console.warn('Firestore getDoctorById error:', err);
  }
  const store = getStore();
  return store.doctors.find((d) => d.id === id && d.active !== false) || null;
}

export async function getDoctorByEmail(email: string): Promise<Doctor | null> {
  await ensureFirestoreInitialized();
  const doctors = await getDoctors();
  return doctors.find((d) => d.email?.toLowerCase() === email.toLowerCase()) || null;
}

export async function saveDoctor(data: Partial<Doctor> & { name: string; specialization?: string }): Promise<Doctor> {
  await ensureFirestoreInitialized();
  const store = getStore();

  const isEditing = Boolean(data.id);
  const existingIndex = isEditing ? store.doctors.findIndex((d) => d.id === data.id) : -1;
  const id = isEditing && existingIndex >= 0
    ? store.doctors[existingIndex].id
    : data.id || `dr-${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

  // Determine unique email
  let cleanEmail = data.email?.trim().toLowerCase();
  if (!cleanEmail) {
    const baseEmail = `dr.${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}`;
    cleanEmail = `${baseEmail}@smiledental.com`;
    if (!isEditing) {
      let counter = 1;
      while (store.doctors.some((d) => d.email?.toLowerCase() === cleanEmail)) {
        counter++;
        cleanEmail = `${baseEmail}${counter}@smiledental.com`;
      }
    }
  }

  const allBranchIds = store.branches.map((b) => b.id);
  let safeBranchIds = Array.isArray(data.branchIds) && data.branchIds.length > 0
    ? data.branchIds.includes('all')
      ? allBranchIds
      : data.branchIds.filter((b) => b && b !== 'all')
    : [];
  if (safeBranchIds.length === 0) {
    safeBranchIds = allBranchIds.length > 0 ? [allBranchIds[0]] : ['branch-downtown'];
  }

  const safeSpecialization = (data.specialization || 'Cosmetic & Aesthetic Dentistry').trim();

  const updatedDoc: Doctor = {
    id,
    name: data.name.trim(),
    email: cleanEmail,
    password: data.password?.trim() || 'doctor123',
    phone: data.phone?.trim() || '(555) 234-1100',
    title: data.title?.trim() || `Specialist in ${safeSpecialization}`,
    qualification: data.qualification?.trim() || 'DDS / DMD Board Certified',
    specialization: safeSpecialization,
    experienceYears: Number(data.experienceYears) || 5,
    bio: data.bio?.trim() || `${data.name} is a dedicated dental specialist at Smile Dental Clinic committed to gentle, evidence-based patient care.`,
    imageUrl: data.imageUrl?.trim() || `https://picsum.photos/seed/${id}/800/800`,
    branchIds: safeBranchIds,
    serviceIds: Array.isArray(data.serviceIds) && data.serviceIds.length > 0 ? data.serviceIds : [store.services[0]?.id || 'srv-checkup-cleaning'],
    rating: data.rating !== undefined ? Number(data.rating) : 5.0,
    reviewsCount: data.reviewsCount !== undefined ? Number(data.reviewsCount) : 0,
    languages: Array.isArray(data.languages) && data.languages.length > 0 ? data.languages : ['English'],
    active: data.active !== undefined ? data.active : true,
  };

  // 1. Write doctor to Firestore
  try {
    await setDoc(doc(db, 'doctors', updatedDoc.id), updatedDoc);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `doctors/${updatedDoc.id}`);
  }

  // 2. Update local store
  if (existingIndex >= 0) {
    store.doctors[existingIndex] = updatedDoc;
  } else {
    store.doctors.push(updatedDoc);

    // Initial schedule creation for newly registered doctor
    for (let bIdx = 0; bIdx < updatedDoc.branchIds.length; bIdx++) {
      const branchId = updatedDoc.branchIds[bIdx];
      const days = bIdx === 0 ? [1, 2, 3] : [4, 5];
      for (const dayOfWeek of days) {
        const sch: DoctorSchedule = {
          id: `sch-${updatedDoc.id}-${branchId}-${dayOfWeek}`,
          doctorId: updatedDoc.id,
          branchId,
          dayOfWeek,
          startTime: '09:00',
          endTime: '17:00',
          breakStart: '13:00',
          breakEnd: '14:00',
          active: true,
        };
        store.schedules.push(sch);
        try {
          await setDoc(doc(db, 'schedules', sch.id), sch);
        } catch {
          // ignore
        }
      }
    }
  }

  // 3. Keep clinic admins in sync and save to Firestore
  if (cleanEmail) {
    const adminEntry: ClinicAdminAccount = {
      id: `clinic-adm-${updatedDoc.id}`,
      name: updatedDoc.name,
      email: cleanEmail,
      password: updatedDoc.password || 'doctor123',
      phone: updatedDoc.phone || '(555) 234-1100',
      clinicId: updatedDoc.branchIds[0] || 'branch-downtown',
      clinicName: store.branches.find((b) => b.id === updatedDoc.branchIds[0])?.name || 'Smile Dental Studio',
      role: 'clinic_admin',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'clinicAdmins', adminEntry.id), adminEntry);
    } catch (err) {
      console.warn('Firestore clinicAdmins save notice:', err);
    }

    const existingAdminIdx = store.clinicAdmins.findIndex((a) => a.email.toLowerCase() === cleanEmail.toLowerCase());
    if (existingAdminIdx >= 0) {
      store.clinicAdmins[existingAdminIdx] = { ...store.clinicAdmins[existingAdminIdx], ...adminEntry };
    } else {
      store.clinicAdmins.push(adminEntry);
    }

    // 4. Keep patients roster in sync and save to Firestore
    const userEntry: PatientProfile = {
      id: updatedDoc.id,
      fullName: updatedDoc.name,
      email: cleanEmail,
      phone: updatedDoc.phone || '(555) 234-1100',
      role: 'clinic_admin',
      clinicId: updatedDoc.branchIds[0] || 'branch-downtown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'patients', userEntry.id), userEntry);
    } catch (err) {
      console.warn('Firestore patients save notice:', err);
    }
    store.patients.set(cleanEmail, userEntry);
  }

  return updatedDoc;
}

export async function deleteDoctor(id: string): Promise<boolean> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const initialCount = store.doctors.length;

  // 1. Delete from Firestore
  try {
    await deleteDoc(doc(db, 'doctors', id));
    await deleteDoc(doc(db, 'clinicAdmins', `clinic-adm-${id}`));
    await deleteDoc(doc(db, 'patients', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `doctors/${id}`);
  }

  // 2. Update local store
  store.doctors = store.doctors.filter((d) => d.id !== id);
  store.schedules = store.schedules.filter((s) => s.doctorId !== id);
  store.unavailabilities = store.unavailabilities.filter((u) => u.doctorId !== id);
  store.clinicAdmins = store.clinicAdmins.filter((a) => a.id !== `clinic-adm-${id}` && a.id !== id);

  return store.doctors.length < initialCount;
}

// =========================================================================
// CLINIC ADMINS
// =========================================================================

export async function getClinicAdmins(): Promise<ClinicAdminAccount[]> {
  await ensureFirestoreInitialized();
  try {
    const snap = await getDocs(collection(db, 'clinicAdmins'));
    if (!snap.empty) {
      const list: ClinicAdminAccount[] = [];
      snap.forEach((d) => list.push(d.data() as ClinicAdminAccount));
      const store = getStore();
      store.clinicAdmins = list;
    }
  } catch (err) {
    console.warn('Firestore getClinicAdmins error:', err);
  }
  const store = getStore();
  return store.clinicAdmins || [];
}

export async function getClinicAdminByEmail(email: string): Promise<ClinicAdminAccount | null> {
  const admins = await getClinicAdmins();
  const clean = email.trim().toLowerCase();
  return admins.find((c) => c.email.toLowerCase() === clean) || null;
}

export async function createClinicAdmin(data: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  clinicId: string;
}): Promise<{
  success: boolean;
  clinicAdmin?: ClinicAdminAccount;
  error?: string;
}> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const cleanEmail = data.email.trim().toLowerCase();

  const existing = await getClinicAdminByEmail(cleanEmail);
  if (existing) {
    return { success: false, error: 'A clinic administrator with this email already exists.' };
  }

  const branch = await getBranchById(data.clinicId);
  const newClinicAdmin: ClinicAdminAccount = {
    id: `clinic-adm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: data.name.trim(),
    email: cleanEmail,
    password: data.password?.trim() || 'smile1234',
    phone: data.phone?.trim() || '(555) 234-1100',
    clinicId: data.clinicId,
    clinicName: branch?.name || 'Assigned Studio Branch',
    role: 'clinic_admin',
    createdAt: new Date().toISOString(),
  };

  // Write to Firestore
  try {
    await setDoc(doc(db, 'clinicAdmins', newClinicAdmin.id), newClinicAdmin);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clinicAdmins/${newClinicAdmin.id}`);
  }

  store.clinicAdmins.push(newClinicAdmin);

  return {
    success: true,
    clinicAdmin: newClinicAdmin,
  };
}

export async function deleteClinicAdmin(id: string): Promise<boolean> {
  await ensureFirestoreInitialized();
  const store = getStore();

  try {
    await deleteDoc(doc(db, 'clinicAdmins', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `clinicAdmins/${id}`);
  }

  const initialLen = store.clinicAdmins.length;
  store.clinicAdmins = store.clinicAdmins.filter((c) => c.id !== id && c.email.toLowerCase() !== id.toLowerCase());
  return store.clinicAdmins.length < initialLen;
}

// =========================================================================
// SCHEDULES & UNAVAILABILITY
// =========================================================================

export async function getDoctorSchedules(doctorId?: string, branchId?: string): Promise<DoctorSchedule[]> {
  await ensureFirestoreInitialized();
  const store = getStore();
  let schedules = store.schedules.filter((s) => s.active);
  if (doctorId) {
    schedules = schedules.filter((s) => s.doctorId === doctorId);
  }
  if (branchId) {
    schedules = schedules.filter((s) => s.branchId === branchId);
  }
  return schedules;
}

export async function saveDoctorSchedule(data: Partial<DoctorSchedule> & { doctorId: string; branchId: string; dayOfWeek: number }): Promise<DoctorSchedule> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const id = data.id || `sch-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const existingIdx = store.schedules.findIndex((s) => s.id === id);

  const schedule: DoctorSchedule = {
    id,
    doctorId: data.doctorId,
    branchId: data.branchId,
    dayOfWeek: Number(data.dayOfWeek),
    startTime: data.startTime || '09:00',
    endTime: data.endTime || '17:00',
    breakStart: data.breakStart || '13:00',
    breakEnd: data.breakEnd || '14:00',
    active: data.active !== undefined ? data.active : true,
  };

  try {
    await setDoc(doc(db, 'schedules', schedule.id), schedule);
  } catch (err) {
    console.warn('Firestore saveDoctorSchedule notice:', err);
  }

  if (existingIdx >= 0) {
    store.schedules[existingIdx] = schedule;
  } else {
    store.schedules.push(schedule);
  }

  return schedule;
}

export async function deleteDoctorSchedule(id: string): Promise<boolean> {
  await ensureFirestoreInitialized();
  const store = getStore();
  try {
    await deleteDoc(doc(db, 'schedules', id));
  } catch (err) {
    console.warn('Firestore deleteDoctorSchedule notice:', err);
  }
  const initialLen = store.schedules.length;
  store.schedules = store.schedules.filter((s) => s.id !== id);
  return store.schedules.length < initialLen;
}

export async function saveDoctorUnavailability(data: Partial<DoctorUnavailability> & { doctorId: string; date: string; reason: string }): Promise<DoctorUnavailability> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const id = data.id || `unavail-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const existingIdx = store.unavailabilities.findIndex((u) => u.id === id);

  const unavailability: DoctorUnavailability = {
    id,
    doctorId: data.doctorId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    reason: data.reason || 'Personal Time-Off / Leave',
  };

  try {
    await setDoc(doc(db, 'unavailabilities', unavailability.id), unavailability);
  } catch (err) {
    console.warn('Firestore saveDoctorUnavailability notice:', err);
  }

  if (existingIdx >= 0) {
    store.unavailabilities[existingIdx] = unavailability;
  } else {
    store.unavailabilities.push(unavailability);
  }

  return unavailability;
}

export async function deleteDoctorUnavailability(id: string): Promise<boolean> {
  await ensureFirestoreInitialized();
  const store = getStore();
  try {
    await deleteDoc(doc(db, 'unavailabilities', id));
  } catch (err) {
    console.warn('Firestore deleteDoctorUnavailability notice:', err);
  }
  const initialLen = store.unavailabilities.length;
  store.unavailabilities = store.unavailabilities.filter((u) => u.id !== id);
  return store.unavailabilities.length < initialLen;
}

export async function getClinicHolidays(branchId?: string, date?: string): Promise<ClinicHoliday[]> {
  await ensureFirestoreInitialized();
  const store = getStore();
  return store.holidays.filter((h) => {
    if (branchId && h.branchId && h.branchId !== branchId) return false;
    if (date && h.date !== date) return false;
    return true;
  });
}

export async function getDoctorUnavailability(doctorId?: string, date?: string): Promise<DoctorUnavailability[]> {
  await ensureFirestoreInitialized();
  const store = getStore();
  return store.unavailabilities.filter((u) => {
    if (doctorId && u.doctorId !== doctorId) return false;
    if (date && u.date !== date) return false;
    return true;
  });
}

// =========================================================================
// APPOINTMENTS
// =========================================================================

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const mins = m % 60;
  return `${h.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function hydrateAppointment(apt: Appointment, store = getStore()): Appointment {
  const docObj = store.doctors.find((d) => d.id === apt.doctorId);
  const srv = store.services.find((s) => s.id === apt.serviceId);
  const br = store.branches.find((b) => b.id === apt.branchId);

  return {
    ...apt,
    doctorName: docObj?.name || 'Assigned Specialist',
    doctorSpecialization: docObj?.specialization || 'Dental Specialist',
    doctorImage: docObj?.imageUrl,
    serviceName: srv?.name || 'Dental Consultation',
    serviceDuration: srv?.durationMinutes || 45,
    servicePrice: srv?.price || 120,
    branchName: br?.name || 'Smile Dental Clinic',
    branchAddress: br?.address || '',
  };
}

export async function getAppointments(patientEmail?: string, branchId?: string): Promise<Appointment[]> {
  await ensureFirestoreInitialized();
  try {
    const snap = await getDocs(collection(db, 'appointments'));
    if (!snap.empty) {
      const list: Appointment[] = [];
      snap.forEach((d) => list.push(d.data() as Appointment));
      const store = getStore();
      store.appointments = list;
    }
  } catch (err) {
    console.warn('Firestore getAppointments error:', err);
  }

  const store = getStore();
  let list = [...store.appointments];
  if (patientEmail) {
    list = list.filter((a) => a.patientEmail.toLowerCase() === patientEmail.toLowerCase());
  }
  if (branchId && branchId !== 'all') {
    list = list.filter((a) => a.branchId === branchId);
  }

  return list.map((apt) => hydrateAppointment(apt, store));
}

export async function getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
  await ensureFirestoreInitialized();
  const all = await getAppointments();
  return all
    .filter((a) => a.doctorId === doctorId)
    .sort((a, b) => {
      const dateCmp = b.appointmentDate.localeCompare(a.appointmentDate);
      if (dateCmp !== 0) return dateCmp;
      return b.startTime.localeCompare(a.startTime);
    });
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const apt = store.appointments.find((a) => a.id === id || a.appointmentCode === id);
  if (!apt) return null;
  return hydrateAppointment(apt, store);
}

export async function checkSlotAvailability(
  doctorId: string,
  branchId: string,
  date: string,
  startTime: string,
  durationMinutes: number,
  excludeAppointmentId?: string
): Promise<{ available: boolean; reason?: string; endTime?: string }> {
  await ensureFirestoreInitialized();
  const store = getStore();

  const targetDate = new Date(`${date}T00:00:00`);
  if (isNaN(targetDate.getTime())) {
    return { available: false, reason: 'Invalid date format provided.' };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (date < todayStr) {
    return { available: false, reason: 'Cannot book appointments for past dates.' };
  }

  const holiday = store.holidays.find(
    (h) => (!h.branchId || h.branchId === branchId) && h.date === date
  );
  if (holiday) {
    return { available: false, reason: `Clinic is closed: ${holiday.reason}` };
  }

  const unavailability = store.unavailabilities.find(
    (u) => u.doctorId === doctorId && u.date === date
  );
  if (unavailability) {
    return { available: false, reason: `Doctor is unavailable on this date: ${unavailability.reason}` };
  }

  const dayOfWeek = targetDate.getDay();
  const schedule = store.schedules.find(
    (s) => s.doctorId === doctorId && s.branchId === branchId && s.dayOfWeek === dayOfWeek && s.active
  );

  // If no strict schedule in prototype, allow default clinic hours
  const reqStart = timeToMinutes(startTime);
  const reqEnd = reqStart + durationMinutes;

  if (schedule) {
    const schedStart = timeToMinutes(schedule.startTime);
    const schedEnd = timeToMinutes(schedule.endTime);
    const breakStart = timeToMinutes(schedule.breakStart);
    const breakEnd = timeToMinutes(schedule.breakEnd);

    if (reqStart < schedStart || reqEnd > schedEnd) {
      return { available: false, reason: 'Requested time is outside doctor working hours.' };
    }

    if (!(reqEnd <= breakStart || reqStart >= breakEnd)) {
      return { available: false, reason: 'Requested time conflicts with scheduled doctor break.' };
    }
  }

  const conflicting = store.appointments.find((apt) => {
    if (apt.id === excludeAppointmentId) return false;
    if (apt.doctorId !== doctorId || apt.appointmentDate !== date) return false;
    if (apt.status === 'cancelled') return false;

    const aptStart = timeToMinutes(apt.startTime);
    const aptEnd = timeToMinutes(apt.endTime);
    return reqStart < aptEnd && reqEnd > aptStart;
  });

  if (conflicting) {
    return { available: false, reason: 'This time slot is already reserved by another patient.' };
  }

  return {
    available: true,
    endTime: minutesToTime(reqEnd),
  };
}

export async function createAppointment(payload: BookingPayload): Promise<Appointment> {
  await ensureFirestoreInitialized();
  const store = getStore();

  const doctor = await getDoctorById(payload.doctorId);
  if (!doctor) throw new Error('Selected doctor does not exist or is inactive.');

  const branch = await getBranchById(payload.branchId);
  if (!branch) throw new Error('Selected branch does not exist.');

  const service = await getServiceById(payload.serviceId);
  if (!service) throw new Error('Selected service does not exist.');

  if (!payload.patientName?.trim() || !payload.patientEmail?.trim() || !payload.patientPhone?.trim()) {
    throw new Error('Patient name, email, and contact phone are required.');
  }

  const duration = service.durationMinutes || 45;
  const availabilityCheck = await checkSlotAvailability(
    payload.doctorId,
    payload.branchId,
    payload.appointmentDate,
    payload.startTime,
    duration
  );

  if (!availabilityCheck.available) {
    throw new Error(availabilityCheck.reason || 'Requested time slot is no longer available.');
  }

  const newId = `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const codeNumber = Math.floor(1000 + Math.random() * 9000);
  const appointmentCode = `SD-${codeNumber}`;

  const newAppointment: Appointment = {
    id: newId,
    appointmentCode,
    patientId: payload.patientEmail.toLowerCase(),
    patientName: payload.patientName.trim(),
    patientEmail: payload.patientEmail.trim().toLowerCase(),
    patientPhone: payload.patientPhone.trim(),
    doctorId: payload.doctorId,
    branchId: payload.branchId,
    serviceId: payload.serviceId,
    appointmentDate: payload.appointmentDate,
    startTime: payload.startTime,
    endTime: availabilityCheck.endTime || minutesToTime(timeToMinutes(payload.startTime) + duration),
    status: 'confirmed',
    notes: payload.notes?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Write to Firestore
  try {
    await setDoc(doc(db, 'appointments', newAppointment.id), newAppointment);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `appointments/${newAppointment.id}`);
  }

  store.appointments.unshift(newAppointment);

  // Save patient profile
  await savePatient({
    email: payload.patientEmail.trim().toLowerCase(),
    fullName: payload.patientName.trim(),
    phone: payload.patientPhone.trim(),
    medicalNotes: payload.notes?.trim() || '',
  });

  return hydrateAppointment(newAppointment, store);
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus, notes?: string): Promise<Appointment> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const apt = store.appointments.find((a) => a.id === id || a.appointmentCode === id);
  if (!apt) throw new Error('Appointment not found.');

  apt.status = status;
  if (notes) {
    apt.notes = apt.notes ? `${apt.notes} | Clinical Update: ${notes}` : notes;
  }
  apt.updatedAt = new Date().toISOString();

  try {
    await setDoc(doc(db, 'appointments', apt.id), apt);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `appointments/${apt.id}`);
  }

  return hydrateAppointment(apt, store);
}

export async function rescheduleAppointment(payload: ReschedulePayload): Promise<Appointment> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const apt = store.appointments.find((a) => a.id === payload.appointmentId || a.appointmentCode === payload.appointmentId);
  if (!apt) throw new Error('Appointment not found.');

  const service = await getServiceById(apt.serviceId);
  const duration = service?.durationMinutes || 45;

  const availabilityCheck = await checkSlotAvailability(
    apt.doctorId,
    apt.branchId,
    payload.newDate,
    payload.newStartTime,
    duration,
    apt.id
  );

  if (!availabilityCheck.available) {
    throw new Error(availabilityCheck.reason || 'New selected slot is not available.');
  }

  apt.appointmentDate = payload.newDate;
  apt.startTime = payload.newStartTime;
  apt.endTime = availabilityCheck.endTime || minutesToTime(timeToMinutes(payload.newStartTime) + duration);
  apt.status = 'confirmed';
  apt.updatedAt = new Date().toISOString();
  if (payload.reason) {
    apt.notes = `${apt.notes ? apt.notes + ' | ' : ''}Rescheduled: ${payload.reason}`;
  }

  try {
    await setDoc(doc(db, 'appointments', apt.id), apt);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `appointments/${apt.id}`);
  }

  return hydrateAppointment(apt, store);
}

export async function cancelAppointment(appointmentId: string, patientEmail?: string, reason?: string): Promise<Appointment> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const apt = store.appointments.find((a) => a.id === appointmentId || a.appointmentCode === appointmentId);
  if (!apt) throw new Error('Appointment not found.');

  apt.status = 'cancelled';
  apt.cancelReason = reason || 'Patient cancelled online.';
  apt.updatedAt = new Date().toISOString();

  try {
    await setDoc(doc(db, 'appointments', apt.id), apt);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `appointments/${apt.id}`);
  }

  return hydrateAppointment(apt, store);
}

// =========================================================================
// PATIENTS / REGISTERED USERS
// =========================================================================

export async function getRegisteredUsers(branchId?: string): Promise<(PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string })[]> {
  await ensureFirestoreInitialized();
  try {
    const snap = await getDocs(collection(db, 'patients'));
    if (!snap.empty) {
      const store = getStore();
      snap.forEach((d) => {
        const p = d.data() as PatientProfile;
        if (p.email) store.patients.set(p.email.toLowerCase(), p);
      });
    }
  } catch (err) {
    console.warn('Firestore getRegisteredUsers error:', err);
  }

  const store = getStore();
  const patientsList: (PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string })[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  store.patients.forEach((patient) => {
    const branchApts = branchId && branchId !== 'all'
      ? store.appointments.filter((a) => a.branchId === branchId)
      : store.appointments;

    const userApts = branchApts.filter(
      (a) => a.patientEmail.toLowerCase() === patient.email.toLowerCase() || a.patientId === patient.id
    );

    if (branchId && branchId !== 'all' && userApts.length === 0 && patient.clinicId !== branchId) {
      return;
    }

    const upcoming = userApts.filter((a) => a.status === 'confirmed' && a.appointmentDate >= todayStr).length;
    const sortedApts = [...userApts].sort((a, b) => b.appointmentDate.localeCompare(a.appointmentDate));
    const lastVisit = sortedApts[0]?.appointmentDate;

    patientsList.push({
      ...patient,
      totalAppointments: userApts.length,
      upcomingAppointments: upcoming,
      lastVisit,
    });
  });

  return patientsList.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function savePatient(data: Partial<PatientProfile> & { email: string; fullName: string }): Promise<PatientProfile> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const emailKey = data.email.trim().toLowerCase();
  const existing = store.patients.get(emailKey);

  const profile: PatientProfile = {
    id: existing?.id || data.id || `pat-${Date.now()}`,
    authUserId: data.authUserId || existing?.authUserId,
    fullName: data.fullName.trim(),
    email: emailKey,
    phone: data.phone?.trim() || existing?.phone || '(555) 000-0000',
    dateOfBirth: data.dateOfBirth || existing?.dateOfBirth,
    gender: data.gender || existing?.gender,
    address: data.address || existing?.address,
    dentalInsurance: data.dentalInsurance || existing?.dentalInsurance,
    medicalNotes: data.medicalNotes || existing?.medicalNotes,
    createdAt: existing?.createdAt || data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'patients', profile.id), profile);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `patients/${profile.id}`);
  }

  store.patients.set(emailKey, profile);
  return profile;
}

export async function deletePatient(emailOrId: string): Promise<boolean> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const emailKey = emailOrId.toLowerCase();

  let targetId = emailOrId;
  if (store.patients.has(emailKey)) {
    targetId = store.patients.get(emailKey)!.id;
    store.patients.delete(emailKey);
  }

  try {
    await deleteDoc(doc(db, 'patients', targetId));
  } catch (err) {
    console.warn('Firestore deletePatient notice:', err);
  }

  for (const [key, patient] of store.patients.entries()) {
    if (patient.id === emailOrId) {
      store.patients.delete(key);
      return true;
    }
  }
  return true;
}

// =========================================================================
// ADMIN STATS & DATABASE UTILS
// =========================================================================

export async function getAdminStats() {
  await ensureFirestoreInitialized();
  const store = getStore();
  const todayStr = new Date().toISOString().split('T')[0];

  const totalAppointments = store.appointments.length;
  const confirmedAppointments = store.appointments.filter((a) => a.status === 'confirmed').length;
  const cancelledAppointments = store.appointments.filter((a) => a.status === 'cancelled').length;
  const upcomingAppointments = store.appointments.filter(
    (a) => a.status === 'confirmed' && a.appointmentDate >= todayStr
  ).length;

  return {
    totalDoctors: store.doctors.length,
    totalBranches: store.branches.length,
    totalServices: store.services.length,
    totalAppointments,
    totalPatients: store.patients.size,
    totalSchedules: store.schedules.length,
    upcomingAppointments,
    confirmedAppointments,
    cancelledAppointments,
  };
}

export async function exportFullDatabase() {
  await ensureFirestoreInitialized();
  const store = getStore();
  const patientsArray: PatientProfile[] = [];
  store.patients.forEach((p) => patientsArray.push(p));

  return {
    version: '2.0-firebase',
    exportedAt: new Date().toISOString(),
    branches: store.branches,
    services: store.services,
    doctors: store.doctors,
    schedules: store.schedules,
    holidays: store.holidays,
    appointments: store.appointments,
    patients: patientsArray,
    clinicAdmins: store.clinicAdmins,
    adminAccounts: store.adminAccounts,
  };
}

export async function resetDatabase() {
  await ensureFirestoreInitialized();
  const store = getStore();
  store.branches = [...INITIAL_BRANCHES];
  store.services = [...INITIAL_SERVICES];
  store.doctors = [...INITIAL_DOCTORS];
  store.schedules = [...INITIAL_SCHEDULES];
  store.holidays = [...INITIAL_HOLIDAYS];
  store.appointments = [...INITIAL_APPOINTMENTS];
  store.patients = initPatientsMap();
  store.clinicAdmins = [...INITIAL_CLINIC_ADMINS];

  for (const b of INITIAL_BRANCHES) await setDoc(doc(db, 'branches', b.id), b);
  for (const d of INITIAL_DOCTORS) await setDoc(doc(db, 'doctors', d.id), d);
  for (const s of INITIAL_SERVICES) await setDoc(doc(db, 'services', s.id), s);

  return {
    success: true,
    message: 'Database reset to original seed dataset.',
    counts: {
      branches: store.branches.length,
      doctors: store.doctors.length,
      services: store.services.length,
    }
  };
}

// =========================================================================
// PERSONAL ASSISTANTS (PA)
// =========================================================================

export async function getAllPersonalAssistants(): Promise<PersonalAssistant[]> {
  await ensureFirestoreInitialized();
  const store = getStore();
  return store.personalAssistants;
}

export async function getPersonalAssistantForDoctor(doctorId: string): Promise<PersonalAssistant | null> {
  await ensureFirestoreInitialized();
  const store = getStore();
  return store.personalAssistants.find((pa) => pa.doctorId === doctorId) || null;
}

export async function getPersonalAssistantByEmail(email: string): Promise<PersonalAssistant | null> {
  await ensureFirestoreInitialized();
  const store = getStore();
  return store.personalAssistants.find((pa) => pa.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function savePersonalAssistant(
  doctorId: string,
  paData: {
    name: string;
    email: string;
    phone: string;
    title?: string;
    password?: string;
    avatarUrl?: string;
    status?: 'active' | 'inactive' | 'on-leave';
    permissions?: {
      canManageAppointments: boolean;
      canManageSchedules: boolean;
      canViewPatientNotes: boolean;
      canReschedule: boolean;
      canSendReminders: boolean;
    };
  }
): Promise<{ success: boolean; pa?: PersonalAssistant; error?: string }> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const doctor = store.doctors.find((d) => d.id === doctorId);
  if (!doctor) {
    return { success: false, error: 'Doctor not found in clinic records.' };
  }

  const existingPAIndex = store.personalAssistants.findIndex((pa) => pa.doctorId === doctorId);
  const defaultPerms = {
    canManageAppointments: true,
    canManageSchedules: true,
    canViewPatientNotes: true,
    canReschedule: true,
    canSendReminders: true,
    ...(paData.permissions || {}),
  };

  const paId = existingPAIndex >= 0 ? store.personalAssistants[existingPAIndex].id : `pa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const updatedPA: PersonalAssistant = {
    id: paId,
    doctorId: doctor.id,
    doctorName: doctor.name,
    name: paData.name.trim(),
    email: paData.email.trim().toLowerCase(),
    phone: paData.phone.trim(),
    title: paData.title || 'Personal Assistant (PA)',
    password: paData.password || 'pa123',
    avatarUrl: paData.avatarUrl || `https://picsum.photos/seed/${encodeURIComponent(paData.name)}/400/400`,
    status: paData.status || 'active',
    permissions: defaultPerms,
    createdAt: existingPAIndex >= 0 ? store.personalAssistants[existingPAIndex].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'personalAssistants', updatedPA.id), updatedPA);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `personalAssistants/${updatedPA.id}`);
  }

  if (existingPAIndex >= 0) {
    store.personalAssistants[existingPAIndex] = updatedPA;
  } else {
    store.personalAssistants.push(updatedPA);
  }

  return { success: true, pa: updatedPA };
}

export async function deletePersonalAssistant(doctorId: string): Promise<{ success: boolean; message: string }> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const target = store.personalAssistants.find((pa) => pa.doctorId === doctorId);
  if (target) {
    try {
      await deleteDoc(doc(db, 'personalAssistants', target.id));
    } catch {
      // ignore
    }
    store.personalAssistants = store.personalAssistants.filter((pa) => pa.doctorId !== doctorId);
    return { success: true, message: 'Doctor Personal Assistant removed.' };
  }
  return { success: false, message: 'No Personal Assistant was found for this doctor.' };
}

// =========================================================================
// HOSPITAL REGISTRATION & ADMIN ACCOUNTS
// =========================================================================

export async function getHospitalRegistrations(): Promise<HospitalRegistration[]> {
  await ensureFirestoreInitialized();
  const store = getStore();
  return store.hospitalRegistrations;
}

export async function getAdminAccounts(): Promise<AdminAccount[]> {
  await ensureFirestoreInitialized();
  try {
    const snap = await getDocs(collection(db, 'adminAccounts'));
    if (!snap.empty) {
      const list: AdminAccount[] = [];
      snap.forEach((d) => list.push(d.data() as AdminAccount));
      const store = getStore();
      store.adminAccounts = list;
    }
  } catch (err) {
    console.warn('Firestore getAdminAccounts error:', err);
  }
  const store = getStore();
  return store.adminAccounts;
}

export async function registerHospitalAndPayFee(payload: {
  hospitalName: string;
  licenseNumber: string;
  directorName: string;
  officialEmail: string;
  phone: string;
  city: string;
  address: string;
  suiteCount?: number;
  paymentMethod?: string;
  registrationFeeAmount?: number;
}) {
  await ensureFirestoreInitialized();
  const store = getStore();
  const hospitalId = `hosp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const tokenString = `adm_inv_${Math.random().toString(36).substring(2, 12)}_${Date.now()}_sec`;
  const transactionId = `TXN-HOSP-${Math.floor(1000000 + Math.random() * 9000000)}`;
  const paidAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
  const feeAmount = payload.registrationFeeAmount || 499.00;

  const newRegistration: HospitalRegistration = {
    id: hospitalId,
    hospitalName: payload.hospitalName.trim(),
    licenseNumber: payload.licenseNumber.trim(),
    directorName: payload.directorName.trim(),
    officialEmail: payload.officialEmail.trim().toLowerCase(),
    phone: payload.phone.trim(),
    city: payload.city.trim(),
    address: payload.address.trim(),
    suiteCount: payload.suiteCount || 6,
    registrationFeeAmount: feeAmount,
    feeCurrency: 'USD',
    feePaymentStatus: 'verified',
    paymentMethod: payload.paymentMethod || 'Credit Card (Corporate)',
    transactionId,
    paidAt,
    adminInviteToken: tokenString,
    adminInviteTokenExpiresAt: expiresAt,
    adminInviteTokenUsed: false,
    createdAt: paidAt,
  };

  const newInviteToken: AdminInviteToken = {
    token: tokenString,
    hospitalId,
    hospitalName: payload.hospitalName.trim(),
    officialEmail: payload.officialEmail.trim().toLowerCase(),
    directorName: payload.directorName.trim(),
    expiresAt,
    used: false,
  };

  try {
    await setDoc(doc(db, 'hospitalRegistrations', hospitalId), newRegistration);
    await setDoc(doc(db, 'adminInviteTokens', tokenString), newInviteToken);
  } catch (err) {
    console.warn('Firestore registerHospital error:', err);
  }

  store.hospitalRegistrations.unshift(newRegistration);
  store.adminInviteTokens.push(newInviteToken);

  return {
    success: true,
    registration: newRegistration,
    inviteToken: newInviteToken,
    inviteUrl: `/hospital/setup-admin?token=${tokenString}`,
    receipt: {
      transactionId,
      amount: feeAmount,
      currency: 'USD',
      paidAt,
      statement: 'If hospital pay the application services fee and the fee is confirmed they can create one admin the link will be sent to them via email(seperate link no one other can access it only use once then link expire)',
    },
  };
}

export async function verifyAdminInviteToken(token: string) {
  await ensureFirestoreInitialized();
  const store = getStore();
  const invite = store.adminInviteTokens.find((t) => t.token === token);
  if (!invite) {
    return {
      valid: false,
      reason: 'not_found' as const,
      message: 'Invalid administrator activation token.',
    };
  }
  if (invite.used) {
    return {
      valid: false,
      reason: 'already_used' as const,
      tokenData: invite,
      message: 'This setup link has already been used and is expired.',
    };
  }
  const now = new Date();
  if (now > new Date(invite.expiresAt)) {
    return {
      valid: false,
      reason: 'expired' as const,
      tokenData: invite,
      message: 'This activation link has expired.',
    };
  }
  const hospital = store.hospitalRegistrations.find((h) => h.id === invite.hospitalId);
  return {
    valid: true,
    tokenData: invite,
    hospital,
    message: 'Valid single-use administrator token.',
  };
}

export async function createAdminFromInviteToken(
  token: string,
  adminData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }
) {
  await ensureFirestoreInitialized();
  const store = getStore();
  const verification = await verifyAdminInviteToken(token);
  if (!verification.valid || !verification.tokenData) {
    return { success: false, error: verification.message };
  }

  const invite = verification.tokenData;
  const hospital = verification.hospital || store.hospitalRegistrations.find((h) => h.id === invite.hospitalId);
  const usedTimestamp = new Date().toISOString();

  const newAdmin: AdminAccount = {
    id: `adm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    hospitalId: invite.hospitalId,
    hospitalName: invite.hospitalName,
    name: adminData.name.trim(),
    email: adminData.email.trim().toLowerCase(),
    password: adminData.password,
    role: 'primary_admin',
    phone: adminData.phone?.trim() || hospital?.phone,
    createdAt: usedTimestamp,
  };

  invite.used = true;
  invite.usedAt = usedTimestamp;
  invite.createdAdminEmail = adminData.email.trim().toLowerCase();
  invite.createdAdminName = adminData.name.trim();

  try {
    await setDoc(doc(db, 'adminAccounts', newAdmin.id), newAdmin);
    await setDoc(doc(db, 'adminInviteTokens', invite.token), invite);
  } catch (err) {
    console.warn('Firestore createAdmin error:', err);
  }

  store.adminAccounts.push(newAdmin);
  return {
    success: true,
    admin: newAdmin,
    message: 'Primary Hospital Administrator account created.',
  };
}

export async function reuploadDatabase(payload: {
  branches?: Branch[];
  services?: Service[];
  doctors?: Doctor[];
  schedules?: DoctorSchedule[];
  holidays?: ClinicHoliday[];
  unavailabilities?: DoctorUnavailability[];
  appointments?: Appointment[];
  patients?: PatientProfile[];
}) {
  await ensureFirestoreInitialized();
  const store = getStore();
  const updatedSummary: Record<string, number> = {};

  if (Array.isArray(payload.branches)) {
    store.branches = payload.branches;
    updatedSummary.branches = payload.branches.length;
    for (const b of payload.branches) {
      try { await setDoc(doc(db, 'branches', b.id), b); } catch {}
    }
  }
  if (Array.isArray(payload.services)) {
    store.services = payload.services;
    updatedSummary.services = payload.services.length;
    for (const s of payload.services) {
      try { await setDoc(doc(db, 'services', s.id), s); } catch {}
    }
  }
  if (Array.isArray(payload.doctors)) {
    store.doctors = payload.doctors;
    updatedSummary.doctors = payload.doctors.length;
    for (const d of payload.doctors) {
      try { await setDoc(doc(db, 'doctors', d.id), d); } catch {}
    }
  }
  if (Array.isArray(payload.schedules)) {
    store.schedules = payload.schedules;
    updatedSummary.schedules = payload.schedules.length;
    for (const sc of payload.schedules) {
      try { await setDoc(doc(db, 'schedules', sc.id), sc); } catch {}
    }
  }
  if (Array.isArray(payload.appointments)) {
    store.appointments = payload.appointments;
    updatedSummary.appointments = payload.appointments.length;
    for (const apt of payload.appointments) {
      try { await setDoc(doc(db, 'appointments', apt.id), apt); } catch {}
    }
  }
  if (Array.isArray(payload.patients)) {
    store.patients.clear();
    for (const p of payload.patients) {
      if (p.email) store.patients.set(p.email.toLowerCase(), p);
      try { await setDoc(doc(db, 'patients', p.id), p); } catch {}
    }
    updatedSummary.patients = payload.patients.length;
  }

  return {
    success: true,
    message: 'Database successfully reloaded with updated clinical dataset.',
    counts: updatedSummary,
    timestamp: new Date().toISOString(),
  };
}

export async function provisionClinicalAdminPanel(
  hospitalId: string,
  provisionedBy = 'Application Super Admin'
): Promise<{
  success: boolean;
  hospital?: HospitalRegistration;
  branch?: Branch;
  inviteUrl?: string;
  error?: string;
  message?: string;
}> {
  await ensureFirestoreInitialized();
  const store = getStore();
  const hospital = store.hospitalRegistrations.find((h) => h.id === hospitalId);
  if (!hospital) {
    return { success: false, error: 'Hospital registration record not found.' };
  }

  const now = new Date().toISOString();
  hospital.panelProvisioned = true;
  hospital.panelProvisionedAt = now;
  hospital.panelProvisionedBy = provisionedBy;

  let branch = store.branches.find(
    (b) => b.id === hospital.branchId || b.name.toLowerCase() === hospital.hospitalName.toLowerCase()
  );
  if (!branch) {
    const branchId = `branch-${hospital.hospitalName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    branch = {
      id: branchId,
      name: hospital.hospitalName,
      city: hospital.city,
      address: hospital.address,
      phone: hospital.phone,
      email: hospital.officialEmail,
      openingHours: 'Mon - Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM',
      description: `${hospital.hospitalName} clinical center licensed under ${hospital.licenseNumber}.`,
      imageUrl: `https://picsum.photos/seed/${branchId}/800/600`,
      rating: 5.0,
      reviewsCount: 1,
      active: true,
    };
    await saveBranch(branch);
    hospital.branchId = branchId;
  } else {
    hospital.branchId = branch.id;
  }

  try {
    await setDoc(doc(db, 'hospitalRegistrations', hospital.id), hospital);
  } catch {}

  const inviteUrl = `/hospital/setup-admin?token=${hospital.adminInviteToken}`;

  return {
    success: true,
    hospital,
    branch,
    inviteUrl,
    message: `Clinical Admin Panel for "${hospital.hospitalName}" successfully provisioned and authorized by Application Admin. Single-use invitation link is active.`,
  };
}

