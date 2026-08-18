-- =========================================================
-- SMILE DENTAL PLATFORM - SUPABASE POSTGRESQL SCHEMA
-- Normalized Schema with RLS Policies & Strict Constraints
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  dental_insurance TEXT,
  medical_notes TEXT,
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Branches Table
CREATE TABLE IF NOT EXISTS branches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  opening_hours TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  rating NUMERIC(2, 1) DEFAULT 4.9,
  reviews_count INT DEFAULT 120,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dental Services Table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('General', 'Cosmetic', 'Restorative', 'Orthodontics', 'Pediatric', 'Surgical')),
  description TEXT NOT NULL,
  short_description TEXT,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  icon_name TEXT DEFAULT 'Sparkles',
  benefits TEXT[] DEFAULT '{}',
  procedure_steps TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  qualification TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience_years INT NOT NULL DEFAULT 5,
  bio TEXT NOT NULL,
  image_url TEXT,
  rating NUMERIC(2, 1) DEFAULT 4.9,
  reviews_count INT DEFAULT 85,
  languages TEXT[] DEFAULT '{"English"}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Doctor-Branch Junction Table
CREATE TABLE IF NOT EXISTS doctor_branches (
  doctor_id TEXT REFERENCES doctors(id) ON DELETE CASCADE,
  branch_id TEXT REFERENCES branches(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, branch_id)
);

-- 6. Doctor-Service Junction Table
CREATE TABLE IF NOT EXISTS doctor_services (
  doctor_id TEXT REFERENCES doctors(id) ON DELETE CASCADE,
  service_id TEXT REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (doctor_id, service_id)
);

-- 7. Doctor Schedules Table
CREATE TABLE IF NOT EXISTS doctor_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id TEXT REFERENCES doctors(id) ON DELETE CASCADE,
  branch_id TEXT REFERENCES branches(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_start TIME DEFAULT '13:00',
  break_end TIME DEFAULT '14:00',
  active BOOLEAN DEFAULT TRUE,
  CONSTRAINT valid_time_range CHECK (start_time < end_time),
  CONSTRAINT valid_break_range CHECK (break_start < break_end)
);

-- 8. Clinic Holidays Table
CREATE TABLE IF NOT EXISTS clinic_holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id TEXT REFERENCES branches(id) ON DELETE CASCADE,
  holiday_date DATE NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Doctor Unavailability / Leave Table
CREATE TABLE IF NOT EXISTS doctor_unavailability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id TEXT REFERENCES doctors(id) ON DELETE CASCADE,
  unavailable_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_code TEXT NOT NULL UNIQUE,
  patient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  doctor_id TEXT NOT NULL REFERENCES doctors(id),
  branch_id TEXT NOT NULL REFERENCES branches(id),
  service_id TEXT NOT NULL REFERENCES services(id),
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no-show')),
  notes TEXT,
  cancel_reason TEXT,
  rescheduled_from_id UUID REFERENCES appointments(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Critical Indexing for High-Performance Availability Calculation & Double-Booking Prevention
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON appointments(doctor_id, appointment_date, start_time) WHERE status != 'cancelled';
CREATE INDEX IF NOT EXISTS idx_appointments_branch_date ON appointments(branch_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_email ON appointments(patient_email);
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_lookup ON doctor_schedules(doctor_id, branch_id, day_of_week);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_unavailability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Public read access for clinic catalog
CREATE POLICY "Public can view active branches" ON branches FOR SELECT USING (active = TRUE);
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (active = TRUE);
CREATE POLICY "Public can view active doctors" ON doctors FOR SELECT USING (active = TRUE);
CREATE POLICY "Public can view doctor branches" ON doctor_branches FOR SELECT USING (TRUE);
CREATE POLICY "Public can view doctor services" ON doctor_services FOR SELECT USING (TRUE);
CREATE POLICY "Public can view doctor schedules" ON doctor_schedules FOR SELECT USING (active = TRUE);
CREATE POLICY "Public can view clinic holidays" ON clinic_holidays FOR SELECT USING (TRUE);
CREATE POLICY "Public can view doctor leaves" ON doctor_unavailability FOR SELECT USING (TRUE);

-- Patient profile RLS
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = auth_user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- Appointments RLS: Patients can only select their own appointments
CREATE POLICY "Patients view own appointments" ON appointments FOR SELECT USING (
  patient_email = auth.jwt() ->> 'email' OR 
  patient_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Patients update own appointments" ON appointments FOR UPDATE USING (
  patient_email = auth.jwt() ->> 'email' OR 
  patient_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
);
