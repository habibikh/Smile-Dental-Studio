-- =========================================================
-- SMILE DENTAL PLATFORM - SEED DATA SCRIPT
-- =========================================================

-- Branches
INSERT INTO branches (id, name, city, address, phone, email, opening_hours, description, image_url, rating, reviews_count, active)
VALUES
  ('branch-downtown', 'Smile Dental - Downtown Metro', 'Downtown', '104 Grand Avenue, Suite 300, Metro City', '(555) 234-5678', 'downtown@smiledental.com', 'Mon - Sat: 8:00 AM - 6:00 PM', 'Our flagship contemporary dental center with 3D intraoral scanners, private suites, and digital smile preview lounges.', 'https://picsum.photos/seed/dentalbranch1/800/600', 4.9, 218, true),
  ('branch-westside', 'Smile Dental - Westside Plaza', 'Westside', '720 Sunset Boulevard, Building B, Metro City', '(555) 345-6789', 'westside@smiledental.com', 'Mon - Fri: 8:30 AM - 6:00 PM, Sat: 9:00 AM - 3:00 PM', 'Specializing in orthodontics, clear aligners, and aesthetic restorations with gentle pediatric dentistry wing.', 'https://picsum.photos/seed/dentalbranch2/800/600', 4.8, 164, true),
  ('branch-northshore', 'Smile Dental - Northshore Medical Center', 'Northshore', '450 Harbor View Way, Medical Tower 2, Metro City', '(555) 456-7890', 'northshore@smiledental.com', 'Mon - Fri: 8:00 AM - 7:00 PM, Sun: 10:00 AM - 4:00 PM', 'Advanced implantology and oral surgery surgical center featuring sedation suites and laser periodontal therapy.', 'https://picsum.photos/seed/dentalbranch3/800/600', 4.9, 142, true),
  ('branch-uptown', 'Smile Dental - Uptown Family Care', 'Uptown', '88 Parkwood Lane, Suite 102, Metro City', '(555) 567-8901', 'uptown@smiledental.com', 'Mon - Sat: 9:00 AM - 5:00 PM', 'Cozy, family-friendly neighborhood practice focused on anxiety-free preventive dentistry and dental hygiene.', 'https://picsum.photos/seed/dentalbranch4/800/600', 4.9, 195, true)
ON CONFLICT (id) DO NOTHING;

-- Services
INSERT INTO services (id, name, category, description, short_description, duration_minutes, price, image_url, icon_name, benefits, procedure_steps, active)
VALUES
  ('srv-checkup-cleaning', 'Comprehensive Dental Checkup & Hygiene', 'General', 'Thorough oral exam, ultrasonic calculus removal, airflow stain polish, digital X-rays, and customized gum health index evaluation.', 'Complete oral evaluation with ultrasonic polish & digital imaging.', 45, 120.00, 'https://picsum.photos/seed/cleaningdent/800/600', 'Sparkles', '{"Prevents periodontal disease", "Removes deep plaque & tartar", "Early cavity detection", "Freshens breath instantly"}', '{"Comprehensive visual examination", "Low-radiation digital bitewing X-rays", "Ultrasonic gentle scaler treatment", "Micro-air polish & fluoride shield"}', true),
  ('srv-whitening', 'Laser In-Clinic Teeth Whitening', 'Cosmetic', 'Professional medical-grade hydrogen peroxide gel activated by LED laser wavelength for up to 8 shades whiter teeth in one session.', 'Transform your smile up to 8 shades brighter in under 60 minutes.', 60, 299.00, 'https://picsum.photos/seed/whiteteeth/800/600', 'Sun', '{"Immediate dramatic results", "Enamel-safe desensitizing formulation", "Long-lasting brightness", "Customized take-home maintenance trays included"}', '{"Shade assessment and clinical prep", "Gingival barrier application for safety", "3x 15-minute active laser illumination cycles", "Anti-sensitivity mineralizing finish"}', true),
  ('srv-invisalign', 'Clear Aligners & Orthodontic Consultation', 'Orthodontics', '3D iTero digital smile scanning with computerized orthodontic outcome simulation and personalized clear aligner treatment roadmap.', 'Discreet orthodontic correction tailored to your dental arches.', 45, 150.00, 'https://picsum.photos/seed/invisalignortho/800/600', 'Smile', '{"Nearly invisible clear aligners", "No dietary restrictions", "Predictable digital 3D staging", "Fewer in-person checkups needed"}', '{"3D high-resolution digital scanning", "AI-assisted orthodontic alignment simulation", "ClinCheck treatment plan review", "Custom aligner fabrication dispatch"}', true),
  ('srv-dental-implant', 'Dental Implant Consultation & Surgical Plan', 'Restorative', 'Titanium root replacement and 3D CBCT bone density scan for permanent single-tooth or full-arch natural tooth replacement.', 'Permanent, lifelike replacement for missing teeth.', 60, 250.00, 'https://picsum.photos/seed/implantdent/800/600', 'Shield', '{"Preserves natural jawbone volume", "Functions like real natural teeth", "Lifetime durability with proper care", "Restores confident chewing & speech"}', '{"3D CBCT volume tomography scan", "Bone volume and nerve mapping", "Computer-guided implant fixture planning", "Custom crown material selection"}', true),
  ('srv-root-canal', 'Endodontic Micro-Root Canal Treatment', 'Restorative', 'Microscope-assisted gentle root canal therapy removing infected pulp, sealing canals, and instantly relieving acute toothache.', 'Pain-free microscopic therapy to rescue infected teeth.', 75, 450.00, 'https://picsum.photos/seed/rootcanal/800/600', 'Activity', '{"Instant acute pain relief", "Saves natural tooth from extraction", "Microscope precision canal disinfection", "Bio-ceramic hermetic sealing"}', '{"Profound computerized local anesthesia", "Rubber dam isolation & microscope access", "Rotary bio-mechanical canal cleaning", "Hermetic gutta-percha seal & core build"}', true),
  ('srv-porcelain-veneers', 'Custom Porcelain Veneers Assessment', 'Cosmetic', 'Ultra-thin handcrafted ceramic veneers engineered to correct chips, gaps, alignment flaws, and deep stubborn discoloration.', 'Artisanal ultra-thin ceramics for a flawless Hollywood smile.', 60, 350.00, 'https://picsum.photos/seed/veneers/800/600', 'Layers', '{"Natural light-reflecting translucency", "Resistant to coffee and tobacco stains", "Custom crafted to facial aesthetics", "Minimal enamel preparation needed"}', '{"Facial harmony & smile design analysis", "Diagnostic wax-up & aesthetic try-in", "Micro-preparation & master impression", "Bonding with dual-cure medical resin"}', true),
  ('srv-pediatric-care', 'Pediatric Gentle Dental Exam & Sealant', 'Pediatric', 'Fun, fear-free dentistry for children with cavity-fighting molar sealants, gentle cleaning, and positive oral habits coaching.', 'Compassionate, tear-free preventive care for bright young smiles.', 40, 95.00, 'https://picsum.photos/seed/pediatricdent/800/600', 'Heart', '{"Builds lifelong positive dental trust", "Protects deep fissures against caries", "Gentle, non-intimidating approach", "Kids prize & certificate included"}', '{"Friendly welcoming introduction", "Count & shine gentle tooth check", "BPA-free protective molar sealant coat", "Topical strawberry fluoridation"}', true),
  ('srv-emergency-relief', 'Urgent Dental Care & Pain Relief', 'General', 'Same-day urgent triage and treatment for broken teeth, lost fillings, acute abscess, trauma, or sudden excruciating toothaches.', 'Priority emergency care to stop pain and protect teeth.', 45, 160.00, 'https://picsum.photos/seed/emergencydent/800/600', 'Zap', '{"Immediate same-day relief", "Digital diagnostics to identify source", "Temporary or definitive repair", "Prescriptions provided as needed"}', '{"Urgent triage & diagnostic X-ray", "Targeted pain-blocking anesthesia", "Stabilization of injury or infection", "Prescription & aftercare scheduling"}', true),
  ('srv-periodontal-therapy', 'Deep Periodontal Scaling & Root Planing', 'General', 'Specialized deep cleaning beneath gumline to eliminate harmful subgingival bacteria colonies and arrest gum recession.', 'Targeted subgingival treatment to reverse early gum disease.', 60, 280.00, 'https://picsum.photos/seed/gumtherapy/800/600', 'ShieldCheck', '{"Halts gum inflammation and bleeding", "Protects alveolar bone structure", "Eliminates deep bacterial pockets", "Smoothes roots for gum re-attachment"}', '{"Periodontal pocket charting", "Targeted localized numbing", "Ultrasonic subgingival biofilm removal", "Antibacterial laser decontamination"}', true)
ON CONFLICT (id) DO NOTHING;

-- Doctors
INSERT INTO doctors (id, name, title, qualification, specialization, experience_years, bio, image_url, rating, reviews_count, languages, active)
VALUES
  ('dr-sarah-chen', 'Dr. Sarah Chen, DDS', 'Lead Cosmetic & Restorative Dentist', 'DDS (Columbia University), AACD Accredited Fellow', 'Cosmetic & Aesthetic Dentistry', 14, 'Dr. Sarah Chen is an internationally recognized aesthetic dentist passionate about minimally invasive smile makeovers, porcelain veneers, and laser teeth whitening.', 'https://picsum.photos/seed/drsarahchen/800/800', 4.9, 142, '{"English", "Mandarin"}', true),
  ('dr-ahmed-khan', 'Dr. Ahmed Khan, DMD, MS', 'Senior Orthodontist & Aligner Specialist', 'DMD (Harvard School of Dental Medicine), MS Orthodontics', 'Orthodontics & Clear Aligners', 12, 'Dr. Ahmed Khan has transformed over 2,500 smiles with personalized clear aligner therapy, rapid orthodontics, and comprehensive bite rehabilitation for teens and adults.', 'https://picsum.photos/seed/drahmedkhan/800/800', 4.9, 118, '{"English", "Arabic", "Urdu"}', true),
  ('dr-elena-rodriguez', 'Dr. Elena Rodriguez, DDS', 'Director of Implantology & Oral Surgery', 'DDS (UCSF Dental), ICOI Diplomate in Implantology', 'Dental Implants & Oral Surgery', 16, 'Specializing in computer-guided 3D dental implants, bone regeneration, and gentle surgical extractions with state-of-the-art sedation protocols.', 'https://picsum.photos/seed/drelena/800/800', 5.0, 160, '{"English", "Spanish"}', true),
  ('dr-marcus-vance', 'Dr. Marcus Vance, DDS', 'Chief Endodontist & Micro-Surgeon', 'DDS (NYU College of Dentistry), Certificate in Endodontics', 'Microscopic Endodontics (Root Canal)', 11, 'Dedicated to painless root canal treatments using high-magnification surgical operating microscopes to preserve natural teeth for a lifetime.', 'https://picsum.photos/seed/drmarcus/800/800', 4.8, 97, '{"English"}', true),
  ('dr-emily-watson', 'Dr. Emily Watson, DMD', 'Pediatric & Family Dentist', 'DMD (University of Pennsylvania), Board Certified Pediatric Dentist', 'Pediatric & Preventive Dentistry', 9, 'Dr. Emily Watson creates a joyful, warm environment where children and families feel completely relaxed and excited about caring for their teeth.', 'https://picsum.photos/seed/dremily/800/800', 4.9, 134, '{"English", "French"}', true),
  ('dr-david-kim', 'Dr. David Kim, DDS', 'General & Periodontal Dentist', 'DDS (UCLA School of Dentistry), AAP Member', 'General Dentistry & Periodontics', 10, 'Focused on holistic preventive care, comprehensive oral hygiene, and non-surgical gum health management with gentle ultrasonic technologies.', 'https://picsum.photos/seed/drdavid/800/800', 4.8, 88, '{"English", "Korean"}', true)
ON CONFLICT (id) DO NOTHING;

-- Doctor-Branch Associations
INSERT INTO doctor_branches (doctor_id, branch_id) VALUES
  ('dr-sarah-chen', 'branch-downtown'),
  ('dr-sarah-chen', 'branch-westside'),
  ('dr-ahmed-khan', 'branch-downtown'),
  ('dr-ahmed-khan', 'branch-westside'),
  ('dr-ahmed-khan', 'branch-uptown'),
  ('dr-elena-rodriguez', 'branch-northshore'),
  ('dr-elena-rodriguez', 'branch-downtown'),
  ('dr-marcus-vance', 'branch-northshore'),
  ('dr-marcus-vance', 'branch-downtown'),
  ('dr-emily-watson', 'branch-uptown'),
  ('dr-emily-watson', 'branch-westside'),
  ('dr-david-kim', 'branch-downtown'),
  ('dr-david-kim', 'branch-uptown')
ON CONFLICT DO NOTHING;

-- Doctor-Service Associations
INSERT INTO doctor_services (doctor_id, service_id) VALUES
  ('dr-sarah-chen', 'srv-checkup-cleaning'),
  ('dr-sarah-chen', 'srv-whitening'),
  ('dr-sarah-chen', 'srv-porcelain-veneers'),
  ('dr-sarah-chen', 'srv-emergency-relief'),
  ('dr-ahmed-khan', 'srv-invisalign'),
  ('dr-ahmed-khan', 'srv-checkup-cleaning'),
  ('dr-elena-rodriguez', 'srv-dental-implant'),
  ('dr-elena-rodriguez', 'srv-emergency-relief'),
  ('dr-marcus-vance', 'srv-root-canal'),
  ('dr-marcus-vance', 'srv-emergency-relief'),
  ('dr-emily-watson', 'srv-pediatric-care'),
  ('dr-emily-watson', 'srv-checkup-cleaning'),
  ('dr-emily-watson', 'srv-whitening'),
  ('dr-david-kim', 'srv-checkup-cleaning'),
  ('dr-david-kim', 'srv-periodontal-therapy'),
  ('dr-david-kim', 'srv-emergency-relief'),
  ('dr-david-kim', 'srv-whitening')
ON CONFLICT DO NOTHING;

-- Schedules (Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6)
INSERT INTO doctor_schedules (doctor_id, branch_id, day_of_week, start_time, end_time, break_start, break_end, active) VALUES
  -- Dr. Sarah Chen (Mon, Tue, Thu Downtown; Wed, Fri Westside)
  ('dr-sarah-chen', 'branch-downtown', 1, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-sarah-chen', 'branch-downtown', 2, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-sarah-chen', 'branch-westside', 3, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-sarah-chen', 'branch-downtown', 4, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-sarah-chen', 'branch-westside', 5, '09:00', '16:00', '12:30', '13:30', true),

  -- Dr. Ahmed Khan (Mon, Wed Downtown; Tue, Thu Westside; Sat Uptown)
  ('dr-ahmed-khan', 'branch-downtown', 1, '08:30', '16:30', '12:30', '13:30', true),
  ('dr-ahmed-khan', 'branch-westside', 2, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-ahmed-khan', 'branch-downtown', 3, '08:30', '16:30', '12:30', '13:30', true),
  ('dr-ahmed-khan', 'branch-westside', 4, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-ahmed-khan', 'branch-uptown', 6, '09:00', '14:00', '12:00', '12:30', true),

  -- Dr. Elena Rodriguez (Mon, Tue, Wed, Thu Northshore; Fri Downtown)
  ('dr-elena-rodriguez', 'branch-northshore', 1, '08:30', '17:30', '13:00', '14:00', true),
  ('dr-elena-rodriguez', 'branch-northshore', 2, '08:30', '17:30', '13:00', '14:00', true),
  ('dr-elena-rodriguez', 'branch-northshore', 3, '08:30', '17:30', '13:00', '14:00', true),
  ('dr-elena-rodriguez', 'branch-northshore', 4, '08:30', '17:30', '13:00', '14:00', true),
  ('dr-elena-rodriguez', 'branch-downtown', 5, '09:00', '16:00', '12:30', '13:30', true),

  -- Dr. Marcus Vance (Tue, Thu, Fri Northshore; Mon, Wed Downtown)
  ('dr-marcus-vance', 'branch-downtown', 1, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-marcus-vance', 'branch-northshore', 2, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-marcus-vance', 'branch-downtown', 3, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-marcus-vance', 'branch-northshore', 4, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-marcus-vance', 'branch-northshore', 5, '09:00', '15:00', '12:00', '13:00', true),

  -- Dr. Emily Watson (Mon, Wed, Fri Uptown; Tue, Thu Westside)
  ('dr-emily-watson', 'branch-uptown', 1, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-emily-watson', 'branch-westside', 2, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-emily-watson', 'branch-uptown', 3, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-emily-watson', 'branch-westside', 4, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-emily-watson', 'branch-uptown', 5, '09:00', '16:00', '12:30', '13:30', true),

  -- Dr. David Kim (Mon, Wed, Fri Downtown; Tue, Thu, Sat Uptown)
  ('dr-david-kim', 'branch-downtown', 1, '08:30', '16:30', '12:30', '13:30', true),
  ('dr-david-kim', 'branch-uptown', 2, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-david-kim', 'branch-downtown', 3, '08:30', '16:30', '12:30', '13:30', true),
  ('dr-david-kim', 'branch-uptown', 4, '09:00', '17:00', '13:00', '14:00', true),
  ('dr-david-kim', 'branch-downtown', 5, '08:30', '16:00', '12:30', '13:30', true),
  ('dr-david-kim', 'branch-uptown', 6, '09:00', '14:00', '12:00', '12:30', true)
ON CONFLICT DO NOTHING;
