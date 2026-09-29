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

// Default In-Memory / Hybrid Dataset initialized with full clinic data
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
    id: 'srv-porcelain-veneers',
    name: 'Custom Porcelain Veneers Assessment',
    category: 'Cosmetic',
    description: 'Ultra-thin handcrafted ceramic veneers engineered to correct chips, gaps, alignment flaws, and deep stubborn discoloration.',
    shortDescription: 'Artisanal ultra-thin ceramics for a flawless Hollywood smile.',
    durationMinutes: 60,
    price: 350.00,
    imageUrl: 'https://picsum.photos/seed/veneers/800/600',
    iconName: 'Layers',
    benefits: ['Natural light-reflecting translucency', 'Resistant to coffee and tobacco stains', 'Custom crafted to facial aesthetics', 'Minimal enamel preparation needed'],
    procedureSteps: ['Facial harmony & smile design analysis', 'Diagnostic wax-up & aesthetic try-in', 'Micro-preparation & master impression', 'Bonding with dual-cure medical resin'],
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
  },
  {
    id: 'srv-emergency-relief',
    name: 'Urgent Dental Care & Pain Relief',
    category: 'General',
    description: 'Same-day urgent triage and treatment for broken teeth, lost fillings, acute abscess, trauma, or sudden excruciating toothaches.',
    shortDescription: 'Priority emergency care to stop pain and protect teeth.',
    durationMinutes: 45,
    price: 160.00,
    imageUrl: 'https://picsum.photos/seed/emergencydent/800/600',
    iconName: 'Zap',
    benefits: ['Immediate same-day relief', 'Digital diagnostics to identify source', 'Temporary or definitive repair', 'Prescriptions provided as needed'],
    procedureSteps: ['Urgent triage & diagnostic X-ray', 'Targeted pain-blocking anesthesia', 'Stabilization of injury or infection', 'Prescription & aftercare scheduling'],
    active: true
  },
  {
    id: 'srv-periodontal-therapy',
    name: 'Deep Periodontal Scaling & Root Planing',
    category: 'General',
    description: 'Specialized deep cleaning beneath gumline to eliminate harmful subgingival bacteria colonies and arrest gum recession.',
    shortDescription: 'Targeted subgingival treatment to reverse early gum disease.',
    durationMinutes: 60,
    price: 280.00,
    imageUrl: 'https://picsum.photos/seed/gumtherapy/800/600',
    iconName: 'ShieldCheck',
    benefits: ['Halts gum inflammation and bleeding', 'Protects alveolar bone structure', 'Eliminates deep bacterial pockets', 'Smoothes roots for gum re-attachment'],
    procedureSteps: ['Periodontal pocket charting', 'Targeted localized numbing', 'Ultrasonic subgingival biofilm removal', 'Antibacterial laser decontamination'],
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
    serviceIds: ['srv-checkup-cleaning', 'srv-whitening', 'srv-porcelain-veneers', 'srv-emergency-relief'],
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
    serviceIds: ['srv-dental-implant', 'srv-emergency-relief'],
    active: true
  },
  {
    id: 'dr-marcus-vance',
    name: 'Dr. Marcus Vance, DDS',
    email: 'dr.marcus.vance@smiledental.com',
    password: 'doctor123',
    phone: '(555) 234-1104',
    title: 'Chief Endodontist & Micro-Surgeon',
    qualification: 'DDS (NYU College of Dentistry), Certificate in Endodontics',
    specialization: 'Microscopic Endodontics (Root Canal)',
    experienceYears: 11,
    bio: 'Dedicated to painless root canal treatments using high-magnification surgical operating microscopes to preserve natural teeth for a lifetime without discomfort.',
    imageUrl: 'https://picsum.photos/seed/drmarcus/800/800',
    rating: 4.8,
    reviewsCount: 97,
    languages: ['English'],
    branchIds: ['branch-northshore', 'branch-downtown'],
    serviceIds: ['srv-root-canal', 'srv-emergency-relief'],
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
  },
  {
    id: 'dr-david-kim',
    name: 'Dr. David Kim, DDS',
    email: 'dr.david.kim@smiledental.com',
    password: 'doctor123',
    phone: '(555) 234-1106',
    title: 'General & Periodontal Dentist',
    qualification: 'DDS (UCLA School of Dentistry), AAP Member',
    specialization: 'General Dentistry & Periodontics',
    experienceYears: 10,
    bio: 'Focused on holistic preventive care, comprehensive oral hygiene, and non-surgical gum health management with gentle ultrasonic technologies.',
    imageUrl: 'https://picsum.photos/seed/drdavid/800/800',
    rating: 4.8,
    reviewsCount: 88,
    languages: ['English', 'Korean'],
    branchIds: ['branch-downtown', 'branch-uptown'],
    serviceIds: ['srv-checkup-cleaning', 'srv-periodontal-therapy', 'srv-emergency-relief', 'srv-whitening'],
    active: true
  }
];

const INITIAL_SCHEDULES: DoctorSchedule[] = [
  // Dr. Sarah Chen (Mon=1, Tue=2, Thu=4 Downtown; Wed=3, Fri=5 Westside)
  { id: 'sch-1', doctorId: 'dr-sarah-chen', branchId: 'branch-downtown', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-2', doctorId: 'dr-sarah-chen', branchId: 'branch-downtown', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-3', doctorId: 'dr-sarah-chen', branchId: 'branch-westside', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-4', doctorId: 'dr-sarah-chen', branchId: 'branch-downtown', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-5', doctorId: 'dr-sarah-chen', branchId: 'branch-westside', dayOfWeek: 5, startTime: '09:00', endTime: '16:00', breakStart: '12:30', breakEnd: '13:30', active: true },

  // Dr. Ahmed Khan (Mon=1, Wed=3 Downtown; Tue=2, Thu=4 Westside; Sat=6 Uptown)
  { id: 'sch-6', doctorId: 'dr-ahmed-khan', branchId: 'branch-downtown', dayOfWeek: 1, startTime: '08:30', endTime: '16:30', breakStart: '12:30', breakEnd: '13:30', active: true },
  { id: 'sch-7', doctorId: 'dr-ahmed-khan', branchId: 'branch-westside', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-8', doctorId: 'dr-ahmed-khan', branchId: 'branch-downtown', dayOfWeek: 3, startTime: '08:30', endTime: '16:30', breakStart: '12:30', breakEnd: '13:30', active: true },
  { id: 'sch-9', doctorId: 'dr-ahmed-khan', branchId: 'branch-westside', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-10', doctorId: 'dr-ahmed-khan', branchId: 'branch-uptown', dayOfWeek: 6, startTime: '09:00', endTime: '14:00', breakStart: '12:00', breakEnd: '12:30', active: true },

  // Dr. Elena Rodriguez (Mon-Thu Northshore; Fri Downtown)
  { id: 'sch-11', doctorId: 'dr-elena-rodriguez', branchId: 'branch-northshore', dayOfWeek: 1, startTime: '08:30', endTime: '17:30', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-12', doctorId: 'dr-elena-rodriguez', branchId: 'branch-northshore', dayOfWeek: 2, startTime: '08:30', endTime: '17:30', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-13', doctorId: 'dr-elena-rodriguez', branchId: 'branch-northshore', dayOfWeek: 3, startTime: '08:30', endTime: '17:30', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-14', doctorId: 'dr-elena-rodriguez', branchId: 'branch-northshore', dayOfWeek: 4, startTime: '08:30', endTime: '17:30', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-15', doctorId: 'dr-elena-rodriguez', branchId: 'branch-downtown', dayOfWeek: 5, startTime: '09:00', endTime: '16:00', breakStart: '12:30', breakEnd: '13:30', active: true },

  // Dr. Marcus Vance (Mon, Wed Downtown; Tue, Thu, Fri Northshore)
  { id: 'sch-16', doctorId: 'dr-marcus-vance', branchId: 'branch-downtown', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-17', doctorId: 'dr-marcus-vance', branchId: 'branch-northshore', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-18', doctorId: 'dr-marcus-vance', branchId: 'branch-downtown', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-19', doctorId: 'dr-marcus-vance', branchId: 'branch-northshore', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-20', doctorId: 'dr-marcus-vance', branchId: 'branch-northshore', dayOfWeek: 5, startTime: '09:00', endTime: '15:00', breakStart: '12:00', breakEnd: '13:00', active: true },

  // Dr. Emily Watson (Mon, Wed, Fri Uptown; Tue, Thu Westside)
  { id: 'sch-21', doctorId: 'dr-emily-watson', branchId: 'branch-uptown', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-22', doctorId: 'dr-emily-watson', branchId: 'branch-westside', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-23', doctorId: 'dr-emily-watson', branchId: 'branch-uptown', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-24', doctorId: 'dr-emily-watson', branchId: 'branch-westside', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-25', doctorId: 'dr-emily-watson', branchId: 'branch-uptown', dayOfWeek: 5, startTime: '09:00', endTime: '16:00', breakStart: '12:30', breakEnd: '13:30', active: true },

  // Dr. David Kim (Mon, Wed, Fri Downtown; Tue, Thu, Sat Uptown)
  { id: 'sch-26', doctorId: 'dr-david-kim', branchId: 'branch-downtown', dayOfWeek: 1, startTime: '08:30', endTime: '16:30', breakStart: '12:30', breakEnd: '13:30', active: true },
  { id: 'sch-27', doctorId: 'dr-david-kim', branchId: 'branch-uptown', dayOfWeek: 2, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-28', doctorId: 'dr-david-kim', branchId: 'branch-downtown', dayOfWeek: 3, startTime: '08:30', endTime: '16:30', breakStart: '12:30', breakEnd: '13:30', active: true },
  { id: 'sch-29', doctorId: 'dr-david-kim', branchId: 'branch-uptown', dayOfWeek: 4, startTime: '09:00', endTime: '17:00', breakStart: '13:00', breakEnd: '14:00', active: true },
  { id: 'sch-30', doctorId: 'dr-david-kim', branchId: 'branch-downtown', dayOfWeek: 5, startTime: '08:30', endTime: '16:00', breakStart: '12:30', breakEnd: '13:30', active: true },
  { id: 'sch-31', doctorId: 'dr-david-kim', branchId: 'branch-uptown', dayOfWeek: 6, startTime: '09:00', endTime: '14:00', breakStart: '12:00', breakEnd: '12:30', active: true },
];

const INITIAL_HOLIDAYS: ClinicHoliday[] = [
  { id: 'hol-1', date: '2026-09-07', reason: 'Labor Day Public Holiday' },
  { id: 'hol-2', date: '2026-11-26', reason: 'Thanksgiving Clinic Closure' },
  { id: 'hol-3', date: '2026-12-25', reason: 'Christmas Day Closure' }
];

const INITIAL_UNAVAILABILITIES: DoctorUnavailability[] = [];

// Seed initial registered patients
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
    id: 'pat-sarah-connor',
    fullName: 'Sarah Connor',
    email: 'sarah.connor@gmail.com',
    phone: '(555) 234-9812',
    dateOfBirth: '1988-11-23',
    gender: 'Female',
    address: '120 Skyline Dr, Metro City',
    dentalInsurance: 'MetLife Dental PPO (ID #ML-9921)',
    medicalNotes: 'Latex allergy. Prefers nitrile dental gloves.',
    createdAt: '2026-01-12T14:15:00.000Z',
    updatedAt: '2026-01-12T14:15:00.000Z',
  },
  {
    id: 'pat-david-kim',
    fullName: 'David Kim',
    email: 'david.kim@techcorp.io',
    phone: '(555) 441-7782',
    dateOfBirth: '1982-08-04',
    gender: 'Male',
    address: '55 Pine Street, Apt 14B, Metro City',
    dentalInsurance: 'Guardian Dental Guard (ID #GD-44120)',
    medicalNotes: 'Completed lower molar implant in 2025. Annual checkup.',
    createdAt: '2026-01-20T09:00:00.000Z',
    updatedAt: '2026-01-20T09:00:00.000Z',
  },
  {
    id: 'pat-elena-rostova',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@designworks.com',
    phone: '(555) 672-3390',
    dateOfBirth: '1995-03-19',
    gender: 'Female',
    address: '808 Arts District Ave, Metro City',
    dentalInsurance: 'Aetna Dental Direct (ID #AET-10293)',
    medicalNotes: 'Invisalign aligner treatment active.',
    createdAt: '2026-02-01T11:45:00.000Z',
    updatedAt: '2026-02-01T11:45:00.000Z',
  },
  {
    id: 'pat-marcus-sterling',
    fullName: 'Marcus Sterling',
    email: 'marcus.sterling@financegrp.com',
    phone: '(555) 912-4433',
    dateOfBirth: '1979-12-01',
    gender: 'Male',
    address: '900 Financial Plaza, Metro City',
    dentalInsurance: 'Cigna Dental Total Care (ID #CG-8831)',
    medicalNotes: 'Bruxism (teeth grinding at night). Uses custom nightguard.',
    createdAt: '2026-02-10T16:20:00.000Z',
    updatedAt: '2026-02-10T16:20:00.000Z',
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

// Seed sample patient appointment for the interactive demo
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
    appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days in future
    startTime: '10:00',
    endTime: '10:45',
    status: 'confirmed',
    notes: 'Routine 6-month checkup and tartar polish.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'apt-seed-2',
    appointmentCode: 'SD-9124',
    patientId: 'pat-elena-rostova',
    patientName: 'Elena Rostova',
    patientEmail: 'elena.rostova@designworks.com',
    patientPhone: '(555) 672-3390',
    doctorId: 'dr-emily-taylor',
    branchId: 'branch-westside',
    serviceId: 'srv-invisalign',
    appointmentDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    startTime: '11:00',
    endTime: '11:45',
    status: 'confirmed',
    notes: 'Invisalign bi-monthly tracking checkup.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'apt-seed-3',
    appointmentCode: 'SD-3051',
    patientId: 'pat-david-kim',
    patientName: 'David Kim',
    patientEmail: 'david.kim@techcorp.io',
    patientPhone: '(555) 441-7782',
    doctorId: 'dr-marcus-vance',
    branchId: 'branch-northshore',
    serviceId: 'srv-implants',
    appointmentDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '15:30',
    status: 'confirmed',
    notes: 'Post-op 3D CBCT implant osseointegration scan.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Initial Personal Assistants (Strictly 1 PA per Doctor)
const INITIAL_PERSONAL_ASSISTANTS: PersonalAssistant[] = [
  {
    id: 'pa-sarah-jenkins',
    doctorId: 'dr-sarah-chen',
    doctorName: 'Dr. Sarah Chen, DDS',
    name: 'Sarah Jenkins, RMA',
    title: 'Clinical PA & Registered Medical Assistant',
    email: 'sarah.pa@smiledental.com',
    phone: '(555) 234-8801',
    password: 'pa123',
    avatarUrl: 'https://picsum.photos/seed/pasarah/400/400',
    status: 'active',
    permissions: {
      canManageAppointments: true,
      canManageSchedules: true,
      canViewPatientNotes: true,
      canReschedule: true,
      canSendReminders: true,
    },
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'pa-alex-rivera',
    doctorId: 'dr-ahmed-khan',
    doctorName: 'Dr. Ahmed Khan, DMD, MS',
    name: 'Alex Rivera, CDA',
    title: 'Orthodontic Personal Coordinator',
    email: 'alex.pa@smiledental.com',
    phone: '(555) 234-8802',
    password: 'pa123',
    avatarUrl: 'https://picsum.photos/seed/paalex/400/400',
    status: 'active',
    permissions: {
      canManageAppointments: true,
      canManageSchedules: true,
      canViewPatientNotes: true,
      canReschedule: true,
      canSendReminders: true,
    },
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'pa-jordan-hayes',
    doctorId: 'dr-elena-rodriguez',
    doctorName: 'Dr. Elena Rodriguez, DDS',
    name: 'Jordan Hayes, RDA',
    title: 'Surgical PA & Implant Care Assistant',
    email: 'jordan.pa@smiledental.com',
    phone: '(555) 234-8803',
    password: 'pa123',
    avatarUrl: 'https://picsum.photos/seed/pajordan/400/400',
    status: 'active',
    permissions: {
      canManageAppointments: true,
      canManageSchedules: true,
      canViewPatientNotes: true,
      canReschedule: true,
      canSendReminders: true,
    },
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-01-15T09:00:00.000Z',
  },
];

// Initial Hospital Registrations (Hospital application service fee confirmed)
const INITIAL_HOSPITAL_REGISTRATIONS: HospitalRegistration[] = [
  {
    id: 'hosp-metro-smile',
    hospitalName: 'Metro Smile Dental Hospital & Surgical Pavilion',
    licenseNumber: 'HOSP-MED-2026-88392',
    directorName: 'Dr. Jonathan Reynolds, Chief Medical Officer',
    officialEmail: 'licensing@smiledental.com',
    phone: '(555) 234-5000',
    city: 'Metro City',
    address: '100 Grand Medical Way, Pavilion 4',
    suiteCount: 18,
    registrationFeeAmount: 499.00,
    feeCurrency: 'USD',
    feePaymentStatus: 'verified',
    paymentMethod: 'Credit Card (Corporate)',
    transactionId: 'TXN-HOSP-9948271',
    paidAt: '2026-01-10T12:00:00.000Z',
    adminInviteToken: 'adm_inv_demo_primary_claimed',
    adminInviteTokenExpiresAt: '2026-01-12T12:00:00.000Z',
    adminInviteTokenUsed: true,
    adminCreatedEmail: 'admin@smiledental.com',
    adminCreatedAt: '2026-01-10T14:30:00.000Z',
    panelProvisioned: true,
    panelProvisionedAt: '2026-01-10T12:05:00.000Z',
    panelProvisionedBy: 'Application Super Admin',
    branchId: 'branch-downtown',
    createdAt: '2026-01-10T12:00:00.000Z',
  },
  {
    id: 'hosp-apex-maxillo',
    hospitalName: 'Apex Dental Hospital & Maxillofacial Center',
    licenseNumber: 'HOSP-APEX-2026-44019',
    directorName: 'Dr. Marcus Vance, Surgical Director',
    officialEmail: 'operations@apexdentalhospital.org',
    phone: '(555) 678-9100',
    city: 'Metro City',
    address: '880 Pavilion Expressway, Tower North',
    suiteCount: 12,
    registrationFeeAmount: 499.00,
    feeCurrency: 'USD',
    feePaymentStatus: 'verified',
    paymentMethod: 'Bank Wire / Corporate ACH',
    transactionId: 'TXN-HOSP-7719204',
    paidAt: '2026-02-01T09:30:00.000Z',
    adminInviteToken: 'adm_inv_apex_pending_activation_772',
    adminInviteTokenExpiresAt: '2026-12-31T23:59:59.000Z',
    adminInviteTokenUsed: false,
    panelProvisioned: false, // Awaiting Application Admin creation
    branchId: 'branch-northshore',
    createdAt: '2026-02-01T09:30:00.000Z',
  },
];

// Initial Single-Use Admin Invite Tokens
const INITIAL_ADMIN_INVITE_TOKENS: AdminInviteToken[] = [
  {
    token: 'adm_inv_demo_primary_claimed',
    hospitalId: 'hosp-metro-smile',
    hospitalName: 'Metro Smile Dental Hospital & Surgical Pavilion',
    officialEmail: 'licensing@smiledental.com',
    directorName: 'Dr. Jonathan Reynolds',
    expiresAt: '2026-01-12T12:00:00.000Z',
    used: true,
    usedAt: '2026-01-10T14:30:00.000Z',
    createdAdminEmail: 'admin@smiledental.com',
    createdAdminName: 'Hospital System Administrator',
  },
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
  },
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
  },
];

// Persistent Global Storage Store (survives Next.js dev reload cycles)
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
      unavailabilities: [...INITIAL_UNAVAILABILITIES],
      appointments: [...INITIAL_APPOINTMENTS],
      patients: initPatientsMap(),
      personalAssistants: [...INITIAL_PERSONAL_ASSISTANTS],
      hospitalRegistrations: [...INITIAL_HOSPITAL_REGISTRATIONS],
      adminInviteTokens: [...INITIAL_ADMIN_INVITE_TOKENS],
      adminAccounts: [...INITIAL_ADMIN_ACCOUNTS],
      clinicAdmins: [...INITIAL_CLINIC_ADMINS],
    };
  } else if (!global.__smileDentalStore.clinicAdmins) {
    global.__smileDentalStore.clinicAdmins = [...INITIAL_CLINIC_ADMINS];
  }
  return global.__smileDentalStore;
}

// Database helper functions with business logic
export async function getBranches(): Promise<Branch[]> {
  const store = getStore();
  return store.branches.filter((b) => b.active);
}

export async function getBranchById(id: string): Promise<Branch | null> {
  const store = getStore();
  return store.branches.find((b) => b.id === id && b.active) || null;
}

export async function saveBranch(data: Partial<Branch> & { name: string }): Promise<Branch> {
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

  if (existingIndex >= 0) {
    store.branches[existingIndex] = updatedBranch;
  } else {
    store.branches.push(updatedBranch);
  }
  return updatedBranch;
}

export async function deleteBranch(id: string): Promise<boolean> {
  const store = getStore();
  const init = store.branches.length;
  store.branches = store.branches.filter((b) => b.id !== id);

  // Reassign any doctor whose only assigned branch was this deleted branch to another active branch
  const remainingBranch = store.branches[0]?.id;
  if (remainingBranch) {
    store.doctors.forEach((doc) => {
      if (doc.branchIds?.includes(id)) {
        doc.branchIds = doc.branchIds.filter((bId) => bId !== id);
        if (doc.branchIds.length === 0) {
          doc.branchIds = [remainingBranch];
        }
      }
    });
  }

  return store.branches.length < init;
}

export async function getServices(): Promise<Service[]> {
  const store = getStore();
  return store.services.filter((s) => s.active);
}

export async function getServiceById(id: string): Promise<Service | null> {
  const store = getStore();
  return store.services.find((s) => s.id === id && s.active) || null;
}

export async function getDoctors(branchId?: string, serviceId?: string): Promise<Doctor[]> {
  const store = getStore();
  let doctors = store.doctors.filter((d) => d.active);

  if (branchId) {
    doctors = doctors.filter((d) => d.branchIds.includes(branchId));
  }
  if (serviceId) {
    doctors = doctors.filter((d) => d.serviceIds.includes(serviceId));
  }

  return doctors;
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  const store = getStore();
  return store.doctors.find((d) => d.id === id && d.active) || null;
}

export async function getDoctorByEmail(email: string): Promise<Doctor | null> {
  const store = getStore();
  return store.doctors.find((d) => d.email?.toLowerCase() === email.toLowerCase() && d.active) || null;
}

export async function saveDoctor(data: Partial<Doctor> & { name: string; specialization?: string }): Promise<Doctor> {
  const store = getStore();
  
  // If editing existing doctor by ID
  const isEditing = Boolean(data.id);
  let existingIndex = isEditing ? store.doctors.findIndex((d) => d.id === data.id) : -1;
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

  if (existingIndex >= 0) {
    store.doctors[existingIndex] = updatedDoc;
  } else {
    store.doctors.push(updatedDoc);

    // Auto-create initial default schedules for newly added doctors across their assigned branches (Mon-Fri 09:00 - 17:00)
    updatedDoc.branchIds.forEach((branchId, bIdx) => {
      const days = bIdx === 0 ? [1, 2, 3] : [4, 5];
      days.forEach((dayOfWeek) => {
        store.schedules.push({
          id: `sch-${updatedDoc.id}-${branchId}-${dayOfWeek}`,
          doctorId: updatedDoc.id,
          branchId,
          dayOfWeek,
          startTime: '09:00',
          endTime: '17:00',
          breakStart: '13:00',
          breakEnd: '14:00',
          active: true,
        });
      });
    });
  }

  // Keep clinic admins roster in sync so doctor can log in
  if (cleanEmail) {
    const existingAdminIdx = store.clinicAdmins.findIndex((a) => a.email.toLowerCase() === cleanEmail.toLowerCase());
    const adminEntry: ClinicAdminAccount = {
      id: `clinic-adm-${updatedDoc.id}`,
      name: updatedDoc.name,
      email: cleanEmail,
      password: updatedDoc.password || 'doctor123',
      phone: updatedDoc.phone || '(555) 234-1100',
      clinicId: updatedDoc.branchIds[0] || 'branch-downtown',
      role: 'clinic_admin',
      createdAt: new Date().toISOString(),
    };
    if (existingAdminIdx >= 0) {
      store.clinicAdmins[existingAdminIdx] = { ...store.clinicAdmins[existingAdminIdx], ...adminEntry };
    } else {
      store.clinicAdmins.push(adminEntry);
    }

    // Keep patients roster in sync
    const existingPatient = store.patients.get(cleanEmail);
    const userEntry: PatientProfile = {
      id: existingPatient?.id || updatedDoc.id,
      fullName: updatedDoc.name,
      email: cleanEmail,
      phone: updatedDoc.phone || '(555) 234-1100',
      role: 'clinic_admin',
      clinicId: updatedDoc.branchIds[0] || 'branch-downtown',
      createdAt: existingPatient?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.patients.set(cleanEmail, userEntry);
  }

  return updatedDoc;
}

export async function deleteDoctor(id: string): Promise<boolean> {
  const store = getStore();
  const initialCount = store.doctors.length;
  store.doctors = store.doctors.filter((d) => d.id !== id);
  // Also clean up doctor schedules and unavailabilities
  store.schedules = store.schedules.filter((s) => s.doctorId !== id);
  store.unavailabilities = store.unavailabilities.filter((u) => u.doctorId !== id);
  // Clean up clinic admin roster
  store.clinicAdmins = store.clinicAdmins.filter((a) => a.id !== `clinic-adm-${id}` && a.id !== id);
  return store.doctors.length < initialCount;
}

export async function getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
  const store = getStore();
  const list = store.appointments.filter((a) => a.doctorId === doctorId);
  return list
    .map((apt) => hydrateAppointment(apt, store))
    .sort((a, b) => {
      const dateCmp = b.appointmentDate.localeCompare(a.appointmentDate);
      if (dateCmp !== 0) return dateCmp;
      return b.startTime.localeCompare(a.startTime);
    });
}

export async function saveDoctorSchedule(data: Partial<DoctorSchedule> & { doctorId: string; branchId: string; dayOfWeek: number }): Promise<DoctorSchedule> {
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

  if (existingIdx >= 0) {
    store.schedules[existingIdx] = schedule;
  } else {
    store.schedules.push(schedule);
  }

  return schedule;
}

export async function deleteDoctorSchedule(id: string): Promise<boolean> {
  const store = getStore();
  const initialLen = store.schedules.length;
  store.schedules = store.schedules.filter((s) => s.id !== id);
  return store.schedules.length < initialLen;
}

export async function saveDoctorUnavailability(data: Partial<DoctorUnavailability> & { doctorId: string; date: string; reason: string }): Promise<DoctorUnavailability> {
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

  if (existingIdx >= 0) {
    store.unavailabilities[existingIdx] = unavailability;
  } else {
    store.unavailabilities.push(unavailability);
  }

  return unavailability;
}

export async function deleteDoctorUnavailability(id: string): Promise<boolean> {
  const store = getStore();
  const initialLen = store.unavailabilities.length;
  store.unavailabilities = store.unavailabilities.filter((u) => u.id !== id);
  return store.unavailabilities.length < initialLen;
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus, notes?: string): Promise<Appointment> {
  const store = getStore();
  const apt = store.appointments.find((a) => a.id === id || a.appointmentCode === id);
  if (!apt) {
    throw new Error('Appointment not found.');
  }

  apt.status = status;
  if (notes) {
    apt.notes = apt.notes ? `${apt.notes} | Clinical Update: ${notes}` : notes;
  }
  apt.updatedAt = new Date().toISOString();

  return hydrateAppointment(apt, store);
}

export async function getDoctorSchedules(doctorId?: string, branchId?: string): Promise<DoctorSchedule[]> {
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

export async function getClinicHolidays(branchId?: string, date?: string): Promise<ClinicHoliday[]> {
  const store = getStore();
  return store.holidays.filter((h) => {
    if (branchId && h.branchId && h.branchId !== branchId) return false;
    if (date && h.date !== date) return false;
    return true;
  });
}

export async function getDoctorUnavailability(doctorId?: string, date?: string): Promise<DoctorUnavailability[]> {
  const store = getStore();
  return store.unavailabilities.filter((u) => {
    if (doctorId && u.doctorId !== doctorId) return false;
    if (date && u.date !== date) return false;
    return true;
  });
}

export async function getAppointments(patientEmail?: string, branchId?: string): Promise<Appointment[]> {
  const store = getStore();
  let list = [...store.appointments];
  if (patientEmail) {
    list = list.filter((a) => a.patientEmail.toLowerCase() === patientEmail.toLowerCase());
  }
  if (branchId) {
    list = list.filter((a) => a.branchId === branchId);
  }

  // Hydrate with doctor, service, and branch names
  return list.map((apt) => hydrateAppointment(apt, store));
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const store = getStore();
  const apt = store.appointments.find((a) => a.id === id || a.appointmentCode === id);
  if (!apt) return null;
  return hydrateAppointment(apt, store);
}

function hydrateAppointment(apt: Appointment, store = getStore()): Appointment {
  const doc = store.doctors.find((d) => d.id === apt.doctorId);
  const srv = store.services.find((s) => s.id === apt.serviceId);
  const br = store.branches.find((b) => b.id === apt.branchId);

  return {
    ...apt,
    doctorName: doc?.name || 'Assigned Specialist',
    doctorSpecialization: doc?.specialization || 'Dental Specialist',
    doctorImage: doc?.imageUrl,
    serviceName: srv?.name || 'Dental Consultation',
    serviceDuration: srv?.durationMinutes || 45,
    servicePrice: srv?.price || 120,
    branchName: br?.name || 'Smile Dental Clinic',
    branchAddress: br?.address || '',
  };
}

// Convert "HH:MM" to total minutes
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// Convert minutes to "HH:MM"
function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const mins = m % 60;
  return `${h.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * DOUBLE-BOOKING & OVERLAP VERIFICATION ENGINE
 */
export async function checkSlotAvailability(
  doctorId: string,
  branchId: string,
  date: string,
  startTime: string,
  durationMinutes: number,
  excludeAppointmentId?: string
): Promise<{ available: boolean; reason?: string; endTime?: string }> {
  const store = getStore();

  // 1. Check Date Validity
  const targetDate = new Date(`${date}T00:00:00`);
  if (isNaN(targetDate.getTime())) {
    return { available: false, reason: 'Invalid date format provided.' };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (date < todayStr) {
    return { available: false, reason: 'Cannot book appointments for past dates.' };
  }

  // 2. Check Clinic Holiday
  const holiday = store.holidays.find(
    (h) => (!h.branchId || h.branchId === branchId) && h.date === date
  );
  if (holiday) {
    return { available: false, reason: `Clinic is closed: ${holiday.reason}` };
  }

  // 3. Check Doctor Unavailability / Leave
  const unavailability = store.unavailabilities.find(
    (u) => u.doctorId === doctorId && u.date === date
  );
  if (unavailability) {
    return { available: false, reason: `Doctor is unavailable on this date: ${unavailability.reason}` };
  }

  // 4. Find Doctor Schedule for this Day of Week
  const dayOfWeek = targetDate.getDay(); // 0-6
  const schedule = store.schedules.find(
    (s) => s.doctorId === doctorId && s.branchId === branchId && s.dayOfWeek === dayOfWeek && s.active
  );

  if (!schedule) {
    return { available: false, reason: 'Doctor is not scheduled at this clinic branch on this day.' };
  }

  const reqStart = timeToMinutes(startTime);
  const reqEnd = reqStart + durationMinutes;
  const schedStart = timeToMinutes(schedule.startTime);
  const schedEnd = timeToMinutes(schedule.endTime);
  const breakStart = timeToMinutes(schedule.breakStart);
  const breakEnd = timeToMinutes(schedule.breakEnd);

  // 5. Must fit within doctor shift
  if (reqStart < schedStart || reqEnd > schedEnd) {
    return { available: false, reason: 'Requested time is outside the doctor working hours.' };
  }

  // 6. Must not overlap doctor break
  if (!(reqEnd <= breakStart || reqStart >= breakEnd)) {
    return { available: false, reason: 'Requested time conflicts with scheduled doctor break.' };
  }

  // 7. Check for overlapping existing active appointments
  const conflicting = store.appointments.find((apt) => {
    if (apt.id === excludeAppointmentId) return false;
    if (apt.doctorId !== doctorId || apt.appointmentDate !== date) return false;
    if (apt.status === 'cancelled') return false;

    const aptStart = timeToMinutes(apt.startTime);
    const aptEnd = timeToMinutes(apt.endTime);

    // Overlap condition: start < aptEnd && end > aptStart
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

/**
 * ATOMIC APPOINTMENT CREATION WITH RIGOROUS VALIDATION
 */
export async function createAppointment(payload: BookingPayload): Promise<Appointment> {
  const store = getStore();

  const doctor = await getDoctorById(payload.doctorId);
  if (!doctor) throw new Error('Selected doctor does not exist or is inactive.');

  const branch = await getBranchById(payload.branchId);
  if (!branch) throw new Error('Selected branch does not exist.');

  const service = await getServiceById(payload.serviceId);
  if (!service) throw new Error('Selected service does not exist.');

  if (!doctor.branchIds.includes(payload.branchId)) {
    throw new Error(`${doctor.name} does not practice at ${branch.name}.`);
  }

  if (!doctor.serviceIds.includes(payload.serviceId)) {
    throw new Error(`${doctor.name} does not perform ${service.name}.`);
  }

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

  store.appointments.unshift(newAppointment);

  // Automatically ensure patient profile is saved in store
  const existingPatient = store.patients.get(payload.patientEmail.toLowerCase());
  if (!existingPatient) {
    store.patients.set(payload.patientEmail.toLowerCase(), {
      id: `pat-${Date.now()}`,
      fullName: payload.patientName.trim(),
      email: payload.patientEmail.trim().toLowerCase(),
      phone: payload.patientPhone.trim(),
      medicalNotes: payload.notes?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } else {
    // Update phone if newly provided
    if (payload.patientPhone && !existingPatient.phone) {
      existingPatient.phone = payload.patientPhone;
    }
    existingPatient.updatedAt = new Date().toISOString();
  }

  return hydrateAppointment(newAppointment, store);
}

/**
 * RESCHEDULE APPOINTMENT
 */
export async function rescheduleAppointment(payload: ReschedulePayload): Promise<Appointment> {
  const store = getStore();
  const apt = store.appointments.find((a) => a.id === payload.appointmentId || a.appointmentCode === payload.appointmentId);

  if (!apt) {
    throw new Error('Appointment not found.');
  }

  if (payload.patientEmail && apt.patientEmail.toLowerCase() !== payload.patientEmail.toLowerCase()) {
    throw new Error('Unauthorized: You do not own this appointment.');
  }

  if (apt.status === 'cancelled') {
    throw new Error('Cancelled appointments cannot be rescheduled. Please book a new appointment.');
  }

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

  return hydrateAppointment(apt, store);
}

/**
 * CANCEL APPOINTMENT
 */
export async function cancelAppointment(appointmentId: string, patientEmail?: string, reason?: string): Promise<Appointment> {
  const store = getStore();
  const apt = store.appointments.find((a) => a.id === appointmentId || a.appointmentCode === appointmentId);

  if (!apt) {
    throw new Error('Appointment not found.');
  }

  if (patientEmail && apt.patientEmail.toLowerCase() !== patientEmail.toLowerCase()) {
    throw new Error('Unauthorized: You can only cancel your own appointments.');
  }

  if (apt.status === 'cancelled') {
    return hydrateAppointment(apt, store);
  }

  apt.status = 'cancelled';
  apt.cancelReason = reason || 'Patient cancelled online.';
  apt.updatedAt = new Date().toISOString();

  return hydrateAppointment(apt, store);
}

/**
 * =========================================================================
 * ADMIN & DATA RE-UPLOAD CAPABILITIES
 * =========================================================================
 */

/**
 * GET ALL REGISTERED PATIENTS / USERS
 */
export async function getRegisteredUsers(branchId?: string): Promise<(PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string })[]> {
  const store = getStore();
  const patientsList: (PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string })[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  store.patients.forEach((patient) => {
    const branchApts = branchId
      ? store.appointments.filter((a) => a.branchId === branchId)
      : store.appointments;

    const userApts = branchApts.filter(
      (a) => a.patientEmail.toLowerCase() === patient.email.toLowerCase() || a.patientId === patient.id
    );

    // If scoped to a specific branch/clinic, only include if patient has appointments there or matches clinicId
    if (branchId && userApts.length === 0 && patient.clinicId !== branchId) {
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

/**
 * SAVE OR REGISTER A PATIENT
 */
export async function savePatient(data: Partial<PatientProfile> & { email: string; fullName: string }): Promise<PatientProfile> {
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

  store.patients.set(emailKey, profile);
  return profile;
}

/**
 * DELETE PATIENT
 */
export async function deletePatient(emailOrId: string): Promise<boolean> {
  const store = getStore();
  const emailKey = emailOrId.toLowerCase();
  if (store.patients.has(emailKey)) {
    store.patients.delete(emailKey);
    return true;
  }
  // Search by ID
  for (const [key, patient] of store.patients.entries()) {
    if (patient.id === emailOrId) {
      store.patients.delete(key);
      return true;
    }
  }
  return false;
}

/**
 * GET ADMIN HIGH-LEVEL METRICS & STATS
 */
export async function getAdminStats() {
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

/**
 * EXPORT FULL CLINIC DATABASE SNAPSHOT AS JSON
 */
export async function exportFullDatabase() {
  const store = getStore();
  const patientsArray: PatientProfile[] = [];
  store.patients.forEach((p) => patientsArray.push(p));

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    branches: store.branches,
    services: store.services,
    doctors: store.doctors,
    schedules: store.schedules,
    holidays: store.holidays,
    unavailabilities: store.unavailabilities,
    appointments: store.appointments,
    patients: patientsArray,
  };
}

/**
 * REUPLOAD / OVERWRITE DATABASE WITH NEW DATASET
 */
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
  const store = getStore();
  const updatedSummary: Record<string, number> = {};

  if (Array.isArray(payload.branches)) {
    store.branches = payload.branches;
    updatedSummary.branches = payload.branches.length;
  }
  if (Array.isArray(payload.services)) {
    store.services = payload.services;
    updatedSummary.services = payload.services.length;
  }
  if (Array.isArray(payload.doctors)) {
    store.doctors = payload.doctors;
    updatedSummary.doctors = payload.doctors.length;
  }
  if (Array.isArray(payload.schedules)) {
    store.schedules = payload.schedules;
    updatedSummary.schedules = payload.schedules.length;
  }
  if (Array.isArray(payload.holidays)) {
    store.holidays = payload.holidays;
    updatedSummary.holidays = payload.holidays.length;
  }
  if (Array.isArray(payload.unavailabilities)) {
    store.unavailabilities = payload.unavailabilities;
    updatedSummary.unavailabilities = payload.unavailabilities.length;
  }
  if (Array.isArray(payload.appointments)) {
    store.appointments = payload.appointments;
    updatedSummary.appointments = payload.appointments.length;
  }
  if (Array.isArray(payload.patients)) {
    store.patients.clear();
    payload.patients.forEach((p) => {
      if (p.email) store.patients.set(p.email.toLowerCase(), p);
    });
    updatedSummary.patients = payload.patients.length;
  }

  return {
    success: true,
    message: 'Database successfully reloaded with updated clinical dataset.',
    counts: updatedSummary,
    timestamp: new Date().toISOString(),
  };
}

/**
 * RESET DATABASE TO ORIGINAL INITIAL CLINICAL SEEDS
 */
export async function resetDatabase() {
  const store = getStore();
  store.branches = [...INITIAL_BRANCHES];
  store.services = [...INITIAL_SERVICES];
  store.doctors = [...INITIAL_DOCTORS];
  store.schedules = [...INITIAL_SCHEDULES];
  store.holidays = [...INITIAL_HOLIDAYS];
  store.unavailabilities = [...INITIAL_UNAVAILABILITIES];
  store.appointments = [...INITIAL_APPOINTMENTS];
  store.patients = initPatientsMap();

  return {
    success: true,
    message: 'Database reset to original seed dataset.',
    counts: {
      branches: store.branches.length,
      services: store.services.length,
      doctors: store.doctors.length,
      schedules: store.schedules.length,
      holidays: store.holidays.length,
      appointments: store.appointments.length,
      patients: store.patients.size,
    }
  };
}

/**
 * ============================================================================
 * PERSONAL ASSISTANT (PA) MANAGEMENT
 * RULE: Strictly ONLY ONE Personal Assistant per Doctor.
 * ============================================================================
 */

export async function getAllPersonalAssistants(): Promise<PersonalAssistant[]> {
  const store = getStore();
  return store.personalAssistants;
}

export async function getPersonalAssistantForDoctor(doctorId: string): Promise<PersonalAssistant | null> {
  const store = getStore();
  return store.personalAssistants.find((pa) => pa.doctorId === doctorId) || null;
}

export async function getPersonalAssistantByEmail(email: string): Promise<PersonalAssistant | null> {
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
  const store = getStore();
  const doctor = store.doctors.find((d) => d.id === doctorId);
  if (!doctor) {
    return { success: false, error: 'Doctor not found in clinic records.' };
  }

  const existingPAIndex = store.personalAssistants.findIndex((pa) => pa.doctorId === doctorId);

  // Default permissions
  const defaultPerms = {
    canManageAppointments: true,
    canManageSchedules: true,
    canViewPatientNotes: true,
    canReschedule: true,
    canSendReminders: true,
    ...(paData.permissions || {}),
  };

  if (existingPAIndex >= 0) {
    // Update the existing single PA for this doctor
    const current = store.personalAssistants[existingPAIndex];
    const updatedPA: PersonalAssistant = {
      ...current,
      doctorName: doctor.name,
      name: paData.name.trim(),
      email: paData.email.trim().toLowerCase(),
      phone: paData.phone.trim(),
      title: paData.title || current.title || 'Personal Assistant (PA)',
      password: paData.password || current.password || 'pa123',
      avatarUrl: paData.avatarUrl || current.avatarUrl || `https://picsum.photos/seed/${encodeURIComponent(paData.name)}/400/400`,
      status: paData.status || current.status || 'active',
      permissions: defaultPerms,
      updatedAt: new Date().toISOString(),
    };
    store.personalAssistants[existingPAIndex] = updatedPA;
    return { success: true, pa: updatedPA };
  } else {
    // Create new PA for this doctor (ensuring max 1 PA per doctor)
    const newPA: PersonalAssistant = {
      id: `pa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.personalAssistants.push(newPA);
    return { success: true, pa: newPA };
  }
}

export async function deletePersonalAssistant(doctorId: string): Promise<{ success: boolean; message: string }> {
  const store = getStore();
  const initialCount = store.personalAssistants.length;
  store.personalAssistants = store.personalAssistants.filter((pa) => pa.doctorId !== doctorId);
  if (store.personalAssistants.length < initialCount) {
    return { success: true, message: 'Doctor Personal Assistant account successfully removed.' };
  }
  return { success: false, message: 'No Personal Assistant was found for this doctor.' };
}

/**
 * ============================================================================
 * HOSPITAL REGISTRATION & APPLICATION SERVICE FEE
 * Statement:
 * "If hospital pay the application services fee and the fee is confirmed they can create one admin
 * the link will be sent to them via email(seperate link no one other can access it only use once then link expire)"
 * ============================================================================
 */

export async function getHospitalRegistrations(): Promise<HospitalRegistration[]> {
  const store = getStore();
  return store.hospitalRegistrations;
}

export async function getAdminAccounts(): Promise<AdminAccount[]> {
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
}): Promise<{
  success: boolean;
  registration: HospitalRegistration;
  inviteToken: AdminInviteToken;
  inviteUrl: string;
  receipt: {
    transactionId: string;
    amount: number;
    currency: string;
    paidAt: string;
    statement: string;
  };
}> {
  const store = getStore();
  const hospitalId = `hosp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const tokenString = `adm_inv_${Math.random().toString(36).substring(2, 12)}_${Date.now()}_sec`;
  const transactionId = `TXN-HOSP-${Math.floor(1000000 + Math.random() * 9000000)}`;
  const paidAt = new Date().toISOString();
  
  // Expiration: 48 hours from generation
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

  store.hospitalRegistrations.unshift(newRegistration);
  store.adminInviteTokens.push(newInviteToken);

  const inviteUrl = `/hospital/setup-admin?token=${tokenString}`;
  const statement = 'If hospital pay the application services fee and the fee is confirmed they can create one admin the link will be sent to them via email(seperate link no one other can access it only use once then link expire)';

  return {
    success: true,
    registration: newRegistration,
    inviteToken: newInviteToken,
    inviteUrl,
    receipt: {
      transactionId,
      amount: feeAmount,
      currency: 'USD',
      paidAt,
      statement,
    },
  };
}

/**
 * Verify Single-Use Admin Invite Token
 */
export async function verifyAdminInviteToken(token: string): Promise<{
  valid: boolean;
  tokenData?: AdminInviteToken;
  hospital?: HospitalRegistration;
  reason?: 'not_found' | 'expired' | 'already_used';
  message: string;
}> {
  const store = getStore();
  const invite = store.adminInviteTokens.find((t) => t.token === token);

  if (!invite) {
    return {
      valid: false,
      reason: 'not_found',
      message: 'Invalid administrator activation token. No matching hospital registration found.',
    };
  }

  if (invite.used) {
    return {
      valid: false,
      reason: 'already_used',
      tokenData: invite,
      message: 'This exclusive administrator setup link has already been used and is now permanently expired. No other user can access or reuse this link.',
    };
  }

  const now = new Date();
  const exp = new Date(invite.expiresAt);
  if (now > exp) {
    return {
      valid: false,
      reason: 'expired',
      tokenData: invite,
      message: 'This administrator activation invitation link has expired. Please contact hospital licensing to request re-validation.',
    };
  }

  const hospital = store.hospitalRegistrations.find((h) => h.id === invite.hospitalId);

  return {
    valid: true,
    tokenData: invite,
    hospital,
    message: 'Valid single-use administrator activation token.',
  };
}

/**
 * Create Primary Admin Account using Single-Use Invite Token
 * Permanently marks the token as used so no one else can ever access it.
 */
export async function createAdminFromInviteToken(
  token: string,
  adminData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }
): Promise<{
  success: boolean;
  admin?: AdminAccount;
  error?: string;
  message?: string;
}> {
  const store = getStore();
  const verification = await verifyAdminInviteToken(token);

  if (!verification.valid || !verification.tokenData) {
    return {
      success: false,
      error: verification.message,
    };
  }

  const invite = verification.tokenData;
  const hospital = verification.hospital || store.hospitalRegistrations.find((h) => h.id === invite.hospitalId);

  const usedTimestamp = new Date().toISOString();

  // Create Primary Admin Account
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

  // Permanently burn/expire the single-use token
  invite.used = true;
  invite.usedAt = usedTimestamp;
  invite.createdAdminEmail = adminData.email.trim().toLowerCase();
  invite.createdAdminName = adminData.name.trim();

  // Update Hospital registration
  if (hospital) {
    hospital.adminInviteTokenUsed = true;
    hospital.adminCreatedEmail = adminData.email.trim().toLowerCase();
    hospital.adminCreatedAt = usedTimestamp;
  }

  store.adminAccounts.push(newAdmin);

  return {
    success: true,
    admin: newAdmin,
    message: 'Primary Hospital Administrator account successfully created. This single-use activation link has now expired.',
  };
}

/**
 * Application Administrator: Provision Clinical Admin Panel for a registered hospital
 * Requirement: "the clinical admin panel can only be created by admin of the application"
 */
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
  const store = getStore();
  const hospital = store.hospitalRegistrations.find((h) => h.id === hospitalId);
  if (!hospital) {
    return { success: false, error: 'Hospital registration record not found.' };
  }

  const now = new Date().toISOString();
  hospital.panelProvisioned = true;
  hospital.panelProvisionedAt = now;
  hospital.panelProvisionedBy = provisionedBy;

  // Ensure branch studio exists for this hospital
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
    store.branches.push(branch);
    hospital.branchId = branchId;
  } else {
    hospital.branchId = branch.id;
  }

  const inviteUrl = `/hospital/setup-admin?token=${hospital.adminInviteToken}`;

  return {
    success: true,
    hospital,
    branch,
    inviteUrl,
    message: `Clinical Admin Panel for "${hospital.hospitalName}" successfully provisioned and authorized by Application Admin. Single-use invitation link is active.`,
  };
}

/**
 * Clinic Admin Management Functions
 * Requirement: "the clinic admin account can be created by admin"
 */
export async function getClinicAdmins(): Promise<ClinicAdminAccount[]> {
  const store = getStore();
  return store.clinicAdmins || [];
}

export async function getClinicAdminByEmail(email: string): Promise<ClinicAdminAccount | null> {
  const store = getStore();
  const clean = email.trim().toLowerCase();
  return store.clinicAdmins?.find((c) => c.email.toLowerCase() === clean) || null;
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
  const store = getStore();
  if (!store.clinicAdmins) store.clinicAdmins = [...INITIAL_CLINIC_ADMINS];

  const cleanEmail = data.email.trim().toLowerCase();
  if (store.clinicAdmins.some((c) => c.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'A clinic administrator with this email already exists.' };
  }

  const branch = store.branches.find((b) => b.id === data.clinicId);
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

  store.clinicAdmins.push(newClinicAdmin);

  return {
    success: true,
    clinicAdmin: newClinicAdmin,
  };
}

export async function deleteClinicAdmin(id: string): Promise<boolean> {
  const store = getStore();
  if (!store.clinicAdmins) return false;
  const initialLen = store.clinicAdmins.length;
  store.clinicAdmins = store.clinicAdmins.filter((c) => c.id !== id && c.email.toLowerCase() !== id.toLowerCase());
  return store.clinicAdmins.length < initialLen;
}


