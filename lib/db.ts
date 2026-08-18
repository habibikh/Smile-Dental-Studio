import {
  Branch,
  Service,
  Doctor,
  DoctorSchedule,
  ClinicHoliday,
  DoctorUnavailability,
  Appointment,
  PatientProfile,
  BookingPayload,
  ReschedulePayload
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
    };
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

export async function getAppointments(patientEmail?: string): Promise<Appointment[]> {
  const store = getStore();
  let list = [...store.appointments];
  if (patientEmail) {
    list = list.filter((a) => a.patientEmail.toLowerCase() === patientEmail.toLowerCase());
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
export async function getRegisteredUsers(): Promise<(PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string })[]> {
  const store = getStore();
  const patientsList: (PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string })[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  store.patients.forEach((patient) => {
    const userApts = store.appointments.filter(
      (a) => a.patientEmail.toLowerCase() === patient.email.toLowerCase()
    );
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

