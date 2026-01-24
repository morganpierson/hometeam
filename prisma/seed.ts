import { PrismaClient, TradeCategory, Availability, EmployeeStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Clearing existing data...')

  // Delete in order respecting foreign key constraints
  await prisma.message.deleteMany()
  await prisma.hireOffer.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.review.deleteMany()
  await prisma.certification.deleteMany()
  await prisma.portfolioItem.deleteMany()
  await prisma.project.deleteMany()
  await prisma.serviceArea.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.employer.deleteMany()
  await prisma.client.deleteMany()

  console.log('✅ Database cleared')
  console.log('🌱 Seeding database...')

  // Create Employers (Trade Contractor Companies)
  const employers = await Promise.all([
    prisma.employer.create({
      data: {
        name: 'Summit Electric Co.',
        description: 'Full-service electrical contractor specializing in commercial and residential projects. Licensed and insured with 20+ years of experience.',
        size: 'med',
        contactEmail: 'contact@summitelectric.com',
        contactPhone: '(555) 123-4567',
        address: '123 Industrial Way',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202',
        isInsured: true,
        isLicensed: true,
        licenseNumber: 'EC-2024-1234',
        avgRating: 4.8,
        totalReviews: 47,
        specialties: [TradeCategory.ELECTRICIAN],
      },
    }),
    prisma.employer.create({
      data: {
        name: 'Rocky Mountain Plumbing',
        description: 'Expert plumbing services for residential and commercial clients. 24/7 emergency services available.',
        size: 'small',
        contactEmail: 'info@rockymtnplumbing.com',
        contactPhone: '(555) 234-5678',
        address: '456 Main Street',
        city: 'Boulder',
        state: 'CO',
        zipCode: '80301',
        isInsured: true,
        isLicensed: true,
        licenseNumber: 'PL-2024-5678',
        avgRating: 4.6,
        totalReviews: 32,
        specialties: [TradeCategory.PLUMBER],
      },
    }),
    prisma.employer.create({
      data: {
        name: 'Peak HVAC Solutions',
        description: 'Heating, ventilation, and air conditioning specialists. Energy-efficient solutions for homes and businesses.',
        size: 'med',
        contactEmail: 'service@peakhvac.com',
        contactPhone: '(555) 345-6789',
        address: '789 Commerce Dr',
        city: 'Colorado Springs',
        state: 'CO',
        zipCode: '80903',
        isInsured: true,
        isLicensed: true,
        licenseNumber: 'HVAC-2024-9012',
        avgRating: 4.9,
        totalReviews: 58,
        specialties: [TradeCategory.HVAC],
      },
    }),
    prisma.employer.create({
      data: {
        name: 'Frontier General Contractors',
        description: 'Full-service general contracting firm handling projects from residential remodels to commercial build-outs.',
        size: 'large',
        contactEmail: 'projects@frontiergc.com',
        contactPhone: '(555) 456-7890',
        address: '321 Builder Blvd',
        city: 'Fort Collins',
        state: 'CO',
        zipCode: '80521',
        isInsured: true,
        isLicensed: true,
        licenseNumber: 'GC-2024-3456',
        avgRating: 4.7,
        totalReviews: 89,
        specialties: [TradeCategory.GENERAL_CONTRACTOR, TradeCategory.CARPENTER],
      },
    }),
    prisma.employer.create({
      data: {
        name: 'Alpine Roofing & Exteriors',
        description: 'Roofing experts specializing in residential and commercial roofing, siding, and gutter installation.',
        size: 'med',
        contactEmail: 'estimates@alpineroofing.com',
        contactPhone: '(555) 567-8901',
        address: '654 Highland Ave',
        city: 'Lakewood',
        state: 'CO',
        zipCode: '80226',
        isInsured: true,
        isLicensed: true,
        licenseNumber: 'RF-2024-7890',
        avgRating: 4.5,
        totalReviews: 41,
        specialties: [TradeCategory.ROOFER],
      },
    }),
  ])

  console.log(`✅ Created ${employers.length} employers`)

  // Create Employees (Trade Workers)
  const employees = await Promise.all([
    // Summit Electric employees
    prisma.employee.create({
      data: {
        email: 'mike.johnson@email.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        phone: '(555) 111-2222',
        bio: 'Master electrician with 15 years of experience in commercial and residential electrical work. Specialized in smart home installations and energy-efficient upgrades.',
        location: 'Denver, CO',
        tradeCategory: TradeCategory.ELECTRICIAN,
        yearsExperience: 15,
        hourlyRate: 75,
        availability: Availability.AVAILABLE,
        isAvailableForHire: true,
        isBackgroundChecked: true,
        isInsured: true,
        avgRating: 4.9,
        totalReviews: 23,
        employerId: employers[0].id,
        status: EmployeeStatus.ACTIVE,
        isAdmin: true,
      },
    }),
    prisma.employee.create({
      data: {
        email: 'sarah.chen@email.com',
        firstName: 'Sarah',
        lastName: 'Chen',
        phone: '(555) 111-3333',
        bio: 'Journeyman electrician specializing in industrial electrical systems and PLC programming.',
        location: 'Denver, CO',
        tradeCategory: TradeCategory.ELECTRICIAN,
        yearsExperience: 8,
        hourlyRate: 55,
        availability: Availability.ASSIGNED,
        isAvailableForHire: false,
        isBackgroundChecked: true,
        isInsured: false,
        avgRating: 4.7,
        totalReviews: 15,
        employerId: employers[0].id,
        status: EmployeeStatus.ACTIVE,
      },
    }),

    // Rocky Mountain Plumbing employees
    prisma.employee.create({
      data: {
        email: 'carlos.rodriguez@email.com',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        phone: '(555) 222-3333',
        bio: 'Licensed master plumber with expertise in water heater installation, pipe repair, and bathroom remodels. Bilingual English/Spanish.',
        location: 'Boulder, CO',
        tradeCategory: TradeCategory.PLUMBER,
        yearsExperience: 12,
        hourlyRate: 65,
        availability: Availability.AVAILABLE,
        isAvailableForHire: true,
        isBackgroundChecked: true,
        isInsured: true,
        avgRating: 4.8,
        totalReviews: 31,
        employerId: employers[1].id,
        status: EmployeeStatus.ACTIVE,
        isAdmin: true,
      },
    }),
    prisma.employee.create({
      data: {
        email: 'jenny.kim@email.com',
        firstName: 'Jenny',
        lastName: 'Kim',
        phone: '(555) 222-4444',
        bio: 'Apprentice plumber eager to learn and grow. Great attention to detail and strong work ethic.',
        location: 'Boulder, CO',
        tradeCategory: TradeCategory.PLUMBER,
        yearsExperience: 2,
        hourlyRate: 35,
        availability: Availability.AVAILABLE,
        isAvailableForHire: true,
        isBackgroundChecked: true,
        isInsured: false,
        avgRating: 4.5,
        totalReviews: 8,
        employerId: employers[1].id,
        status: EmployeeStatus.ACTIVE,
      },
    }),

    // Peak HVAC employees
    prisma.employee.create({
      data: {
        email: 'david.thompson@email.com',
        firstName: 'David',
        lastName: 'Thompson',
        phone: '(555) 333-4444',
        bio: 'HVAC technician certified in all major brands. Specialized in high-efficiency systems and geothermal installations.',
        location: 'Colorado Springs, CO',
        tradeCategory: TradeCategory.HVAC,
        yearsExperience: 10,
        hourlyRate: 60,
        availability: Availability.AVAILABLE,
        isAvailableForHire: true,
        isBackgroundChecked: true,
        isInsured: true,
        avgRating: 4.9,
        totalReviews: 42,
        employerId: employers[2].id,
        status: EmployeeStatus.ACTIVE,
        isAdmin: true,
      },
    }),
    prisma.employee.create({
      data: {
        email: 'amanda.foster@email.com',
        firstName: 'Amanda',
        lastName: 'Foster',
        phone: '(555) 333-5555',
        bio: 'HVAC installer with focus on ductwork and ventilation systems. EPA certified.',
        location: 'Colorado Springs, CO',
        tradeCategory: TradeCategory.HVAC,
        yearsExperience: 5,
        hourlyRate: 45,
        availability: Availability.ASSIGNED,
        isAvailableForHire: false,
        isBackgroundChecked: true,
        isInsured: false,
        avgRating: 4.6,
        totalReviews: 18,
        employerId: employers[2].id,
        status: EmployeeStatus.ACTIVE,
      },
    }),

    // Frontier General Contractors employees
    prisma.employee.create({
      data: {
        email: 'robert.martinez@email.com',
        firstName: 'Robert',
        lastName: 'Martinez',
        phone: '(555) 444-5555',
        bio: 'Project manager and master carpenter with 20 years in residential and commercial construction.',
        location: 'Fort Collins, CO',
        tradeCategory: TradeCategory.CARPENTER,
        yearsExperience: 20,
        hourlyRate: 85,
        availability: Availability.AVAILABLE,
        isAvailableForHire: true,
        isBackgroundChecked: true,
        isInsured: true,
        avgRating: 4.8,
        totalReviews: 56,
        employerId: employers[3].id,
        status: EmployeeStatus.ACTIVE,
        isAdmin: true,
      },
    }),
    prisma.employee.create({
      data: {
        email: 'lisa.wilson@email.com',
        firstName: 'Lisa',
        lastName: 'Wilson',
        phone: '(555) 444-6666',
        bio: 'Finish carpenter specializing in custom cabinetry, trim work, and built-ins.',
        location: 'Fort Collins, CO',
        tradeCategory: TradeCategory.CARPENTER,
        yearsExperience: 7,
        hourlyRate: 50,
        availability: Availability.AVAILABLE,
        isAvailableForHire: true,
        isBackgroundChecked: true,
        isInsured: false,
        avgRating: 4.7,
        totalReviews: 22,
        employerId: employers[3].id,
        status: EmployeeStatus.ACTIVE,
      },
    }),
    prisma.employee.create({
      data: {
        email: 'marcus.brown@email.com',
        firstName: 'Marcus',
        lastName: 'Brown',
        phone: '(555) 444-7777',
        bio: 'Experienced framer and rough carpenter. Can read blueprints and lead small crews.',
        location: 'Fort Collins, CO',
        tradeCategory: TradeCategory.CARPENTER,
        yearsExperience: 9,
        hourlyRate: 45,
        availability: Availability.UNAVAILABLE,
        isAvailableForHire: false,
        isBackgroundChecked: true,
        isInsured: false,
        avgRating: 4.4,
        totalReviews: 14,
        employerId: employers[3].id,
        status: EmployeeStatus.ACTIVE,
      },
    }),

    // Alpine Roofing employees
    prisma.employee.create({
      data: {
        email: 'james.anderson@email.com',
        firstName: 'James',
        lastName: 'Anderson',
        phone: '(555) 555-6666',
        bio: 'Lead roofer with expertise in shingle, tile, and metal roofing systems. Storm damage specialist.',
        location: 'Lakewood, CO',
        tradeCategory: TradeCategory.ROOFER,
        yearsExperience: 14,
        hourlyRate: 55,
        availability: Availability.AVAILABLE,
        isAvailableForHire: true,
        isBackgroundChecked: true,
        isInsured: true,
        avgRating: 4.6,
        totalReviews: 29,
        employerId: employers[4].id,
        status: EmployeeStatus.ACTIVE,
        isAdmin: true,
      },
    }),
    prisma.employee.create({
      data: {
        email: 'kevin.patel@email.com',
        firstName: 'Kevin',
        lastName: 'Patel',
        phone: '(555) 555-7777',
        bio: 'Roofing technician skilled in flat roof installations and repairs.',
        location: 'Lakewood, CO',
        tradeCategory: TradeCategory.ROOFER,
        yearsExperience: 4,
        hourlyRate: 40,
        availability: Availability.AVAILABLE,
        isAvailableForHire: true,
        isBackgroundChecked: true,
        isInsured: false,
        avgRating: 4.5,
        totalReviews: 11,
        employerId: employers[4].id,
        status: EmployeeStatus.ACTIVE,
      },
    }),

    // Independent contractors (no employer)
    prisma.employee.create({
      data: {
        email: 'tom.white@email.com',
        firstName: 'Tom',
        lastName: 'White',
        phone: '(555) 666-7777',
        bio: 'Independent welder with TIG, MIG, and stick welding certifications. Available for contract work.',
        location: 'Aurora, CO',
        tradeCategory: TradeCategory.WELDER,
        yearsExperience: 11,
        hourlyRate: 70,
        availability: Availability.AVAILABLE,
        isAvailableForHire: true,
        isBackgroundChecked: true,
        isInsured: true,
        avgRating: 4.8,
        totalReviews: 35,
        status: EmployeeStatus.ACTIVE,
      },
    }),
    prisma.employee.create({
      data: {
        email: 'michelle.lee@email.com',
        firstName: 'Michelle',
        lastName: 'Lee',
        phone: '(555) 666-8888',
        bio: 'Professional painter specializing in interior and exterior residential painting. Excellent attention to detail.',
        location: 'Arvada, CO',
        tradeCategory: TradeCategory.PAINTER,
        yearsExperience: 6,
        hourlyRate: 40,
        availability: Availability.AVAILABLE,
        isAvailableForHire: true,
        isBackgroundChecked: true,
        isInsured: true,
        avgRating: 4.9,
        totalReviews: 48,
        status: EmployeeStatus.ACTIVE,
      },
    }),
    prisma.employee.create({
      data: {
        email: 'frank.garcia@email.com',
        firstName: 'Frank',
        lastName: 'Garcia',
        phone: '(555) 777-8888',
        bio: 'Experienced mason specializing in brick, stone, and concrete block work. Restoration expert.',
        location: 'Westminster, CO',
        tradeCategory: TradeCategory.MASON,
        yearsExperience: 18,
        hourlyRate: 65,
        availability: Availability.AVAILABLE,
        isAvailableForHire: true,
        isBackgroundChecked: true,
        isInsured: true,
        avgRating: 4.7,
        totalReviews: 27,
        status: EmployeeStatus.ACTIVE,
      },
    }),
  ])

  console.log(`✅ Created ${employees.length} employees`)

  // Create some certifications for employees
  await Promise.all([
    prisma.certification.create({
      data: {
        name: 'Master Electrician License',
        issuingBody: 'Colorado Dept of Regulatory Agencies',
        licenseNumber: 'ME-2024-12345',
        issuedDate: new Date('2020-03-15'),
        expirationDate: new Date('2026-03-15'),
        verified: true,
        verifiedAt: new Date('2024-01-10'),
        employeeId: employees[0].id,
      },
    }),
    prisma.certification.create({
      data: {
        name: 'Master Plumber License',
        issuingBody: 'Colorado Plumbing Board',
        licenseNumber: 'MP-2024-67890',
        issuedDate: new Date('2018-06-20'),
        expirationDate: new Date('2025-06-20'),
        verified: true,
        verifiedAt: new Date('2024-02-15'),
        employeeId: employees[2].id,
      },
    }),
    prisma.certification.create({
      data: {
        name: 'EPA 608 Certification',
        issuingBody: 'Environmental Protection Agency',
        licenseNumber: 'EPA-608-2024-11111',
        issuedDate: new Date('2019-01-10'),
        verified: true,
        verifiedAt: new Date('2023-12-01'),
        employeeId: employees[4].id,
      },
    }),
    prisma.certification.create({
      data: {
        name: 'OSHA 30-Hour Construction',
        issuingBody: 'OSHA',
        licenseNumber: 'OSHA-30-22222',
        issuedDate: new Date('2022-08-05'),
        verified: true,
        verifiedAt: new Date('2024-01-05'),
        employeeId: employees[6].id,
      },
    }),
    prisma.certification.create({
      data: {
        name: 'AWS Certified Welder',
        issuingBody: 'American Welding Society',
        licenseNumber: 'AWS-CW-33333',
        issuedDate: new Date('2021-04-12'),
        expirationDate: new Date('2027-04-12'),
        verified: true,
        verifiedAt: new Date('2024-01-20'),
        employeeId: employees[12].id,
      },
    }),
  ])

  console.log('✅ Created certifications')

  // Create service areas
  const serviceAreas = await Promise.all([
    prisma.serviceArea.create({
      data: {
        city: 'Denver',
        state: 'CO',
        zipCode: '80202',
        radiusMiles: 25,
        employers: { connect: [{ id: employers[0].id }] },
        employees: { connect: [{ id: employees[0].id }, { id: employees[1].id }] },
      },
    }),
    prisma.serviceArea.create({
      data: {
        city: 'Boulder',
        state: 'CO',
        zipCode: '80301',
        radiusMiles: 20,
        employers: { connect: [{ id: employers[1].id }] },
        employees: { connect: [{ id: employees[2].id }, { id: employees[3].id }] },
      },
    }),
    prisma.serviceArea.create({
      data: {
        city: 'Colorado Springs',
        state: 'CO',
        zipCode: '80903',
        radiusMiles: 30,
        employers: { connect: [{ id: employers[2].id }] },
        employees: { connect: [{ id: employees[4].id }, { id: employees[5].id }] },
      },
    }),
  ])

  console.log(`✅ Created ${serviceAreas.length} service areas`)

  console.log('')
  console.log('🎉 Database seeded successfully!')
  console.log('')
  console.log('Summary:')
  console.log(`  - ${employers.length} employers`)
  console.log(`  - ${employees.length} employees`)
  console.log(`  - ${serviceAreas.length} service areas`)
  console.log('  - 5 certifications')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
