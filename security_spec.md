# Security Specification: Dental Clinic Platform

## 1. Data Invariants
- All document IDs must adhere to standard alphanumerical patterns and max length constraints (`isValidId`).
- Doctors must have a valid non-empty name, email, specialization, and branch assignment.
- Clinic branches must have a valid name, address, and phone number.
- Appointments require an appointmentCode, valid date, start time, patient contact, doctor assignment, and clinic assignment.
- No unbounded string payloads (Denial of Wallet mitigation); string sizes are strictly bounded.

## 2. The Dirty Dozen Payloads (Target Rejections)
1. Doctor payload without name: { specialization: "Cosmetic" } -> Rejected (missing required fields)
2. Doctor with 5MB injected payload in bio: { name: "Dr. Test", bio: "..." } -> Rejected (bio size > 3000 chars)
3. Branch with missing address: { name: "Branch 1" } -> Rejected
4. Appointment with missing appointmentCode: { patientName: "Alex" } -> Rejected
5. Path variable ID poisoning: /doctors/bad%20%2F%20id -> Rejected (id regex guard)
6. Clinic Admin account with invalid email -> Rejected
7. Appointment with oversized notes -> Rejected
8. Schedule without doctorId or branchId -> Rejected
9. Patient registration with empty email -> Rejected
10. Hospital registration with missing license -> Rejected
11. PA creation without doctorId -> Rejected
12. Malicious root collection writes -> Rejected by default deny

## 3. Coverage
- Validation helpers for Branch, Doctor, Service, Schedule, Appointment, Patient, ClinicAdmin, and PA.
- Default deny fallback.
