import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const password = 'Password123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const roles = Object.values(UserRole);

  for (const role of roles) {
    const email = `${role.toLowerCase()}@test.com`;
    
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log(`User for role ${role} already exists, skipping.`);
      continue;
    }

    console.log(`Creating test user for role: ${role}...`);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: role as UserRole,
        status: 'ACTIVE',
        emailVerified: true,
        profile: {
          create: {
            firstName: 'Test',
            lastName: role.charAt(0) + role.slice(1).toLowerCase(),
            displayName: `Test ${role}`,
          },
        },
        consentSettings: {
          create: {
            shareCheckInsWithPractitioner: true,
            shareJournalsWithPractitioner: true,
          },
        },
      },
    });

    // Create specific profiles based on role
    if (role === UserRole.PRACTITIONER) {
      await prisma.practitionerProfile.create({
        data: {
          userId: user.id,
          title: 'Dr.',
          specialization: ['Mental Health', 'Counseling'],
          bio: 'Test practitioner bio',
          languages: ['English', 'Kinyarwanda'],
          isVerified: true,
        },
      });
    }

    if (role === UserRole.CLINIC_ADMIN) {
      const clinic = await prisma.clinicProfile.create({
        data: {
          userId: user.id,
          name: 'Test Clinic',
          description: 'A clinic for testing purposes',
          address: '123 Test St',
          city: 'Kigali',
          country: 'Rwanda',
          phone: '+250123456789',
          workingHours: {
            monday: { open: '08:00', close: '17:00' },
            tuesday: { open: '08:00', close: '17:00' },
            wednesday: { open: '08:00', close: '17:00' },
            thursday: { open: '08:00', close: '17:00' },
            friday: { open: '08:00', close: '17:00' },
          },
          isVerified: true,
        },
      });

      // Link CLINIC_STAFF if we find them or just use this clinic for next iteration
      // For simplicity, we'll create a second clinic staff linked to this clinic if needed
    }

    if (role === UserRole.UNIVERSITY_ADMIN) {
      await prisma.universityProfile.create({
        data: {
          userId: user.id,
          name: 'Test University',
          description: 'A university for testing purposes',
          address: '456 Uni Ave',
          city: 'Kigali',
          country: 'Rwanda',
          isVerified: true,
        },
      });
    }

    if (role === UserRole.NGO_ADMIN) {
      await prisma.nGOProfile.create({
        data: {
          userId: user.id,
          name: 'Test NGO',
          description: 'An NGO for testing purposes',
          focusAreas: ['Mental Health Awareness', 'Community Support'],
          isVerified: true,
        },
      });
    }
  }

  // Handle CLINIC_STAFF linking to a clinic
  const clinicAdmin = await prisma.user.findUnique({
    where: { email: 'clinic_admin@test.com' },
    include: { clinicProfile: true },
  });

  const clinicStaff = await prisma.user.findUnique({
    where: { email: 'clinic_staff@test.com' },
  });

  if (clinicAdmin?.clinicProfile && clinicStaff) {
    await prisma.clinicStaffRole.upsert({
      where: {
        clinicId_userId: {
          clinicId: clinicAdmin.clinicProfile.id,
          userId: clinicStaff.id,
        },
      },
      update: {},
      create: {
        clinicId: clinicAdmin.clinicProfile.id,
        userId: clinicStaff.id,
        role: 'Therapist',
      },
    });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
