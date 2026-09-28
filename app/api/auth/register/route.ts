import { NextRequest, NextResponse } from 'next/server';
import { savePatient, getRegisteredUsers, saveDoctor, getDoctors } from '@/lib/db';
import { PatientProfile } from '@/types/dental';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fullName = (body.fullName || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const phone = (body.phone || '').trim();
    const password = (body.password || '').trim();
    const isDoctor = body.role === 'doctor' || body.accountType === 'doctor';

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: 'Full name and email address are required.' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Please provide a password for your account.' },
        { status: 400 }
      );
    }

    // Check if email already belongs to an existing user or doctor
    const [existingUsers, existingDoctors] = await Promise.all([
      getRegisteredUsers(),
      getDoctors(),
    ]);

    const alreadyExists =
      existingUsers.some((u) => u.email.toLowerCase() === email) ||
      existingDoctors.some((d) => d.email && d.email.toLowerCase() === email);

    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'An account with this email address already exists. Please sign in.',
        },
        { status: 409 }
      );
    }

    if (isDoctor) {
      // Register doctor account
      const doctor = await saveDoctor({
        name: fullName,
        email,
        password,
        phone: phone || '(555) 234-1100',
        title: body.title || `Specialist in ${body.specialization || 'Cosmetic Dentistry'}`,
        qualification: body.qualification || 'DDS / DMD Board Certified',
        specialization: body.specialization || 'Cosmetic & Aesthetic Dentistry',
        experienceYears: Number(body.experienceYears) || 5,
        bio: body.bio || `${fullName} is a dedicated dental specialist at Smile Dental Clinic committed to gentle, evidence-based patient care.`,
        imageUrl: body.imageUrl || `https://picsum.photos/seed/${email.replace(/[^a-z0-9]/g, '')}/800/800`,
        branchIds: body.branchIds?.length ? body.branchIds : [body.clinicId || 'branch-downtown'],
        serviceIds: body.serviceIds?.length ? body.serviceIds : ['srv-checkup-cleaning'],
      });

      const doctorUser: PatientProfile = {
        id: doctor.id,
        fullName: doctor.name,
        email: doctor.email || email,
        phone: doctor.phone || phone || '(555) 234-1100',
        role: 'clinic_admin',
        clinicId: doctor.branchIds?.[0] || 'branch-downtown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        user: doctorUser,
        doctor,
        message: 'Doctor account successfully created! Welcome to Smile Dental Clinical Team.',
      });
    }

    // Save as general user (patient)
    const newPatient = {
      fullName,
      email,
      phone: phone || '(555) 000-0000',
      role: 'patient' as const,
      gender: body.gender || 'Prefer not to say',
      address: body.address || '',
      dentalInsurance: body.dentalInsurance || '',
      medicalNotes: body.medicalNotes || '',
    };

    const saved = await savePatient(newPatient);

    return NextResponse.json({
      success: true,
      user: saved,
      message: 'Account successfully created. Welcome to Smile Dental Studio!',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to register account';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
