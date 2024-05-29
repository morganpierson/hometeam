-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clerkId" TEXT,
    "email" TEXT,
    "isAdmin" BOOLEAN,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" TEXT,
    "employmentStart" TIMESTAMP(3),
    "employmentEnd" TIMESTAMP(3),
    "availableForAcquisition" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT,
    "teamId" TEXT,
    "profileImage" TEXT,
    "resume" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcquisitionOffer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER DEFAULT 0,
    "offeringCompanyId" TEXT NOT NULL,
    "offerType" TEXT,

    CONSTRAINT "AcquisitionOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageThread" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,

    CONSTRAINT "MessageThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sendingCompanyId" TEXT NOT NULL,
    "receivingCompanyId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,

    CONSTRAINT "OfferMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT,
    "logo" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "businessWeight" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "companyId" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserReferences" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompanyToIndustry" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompanyCandidates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MessageThreadCompanies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_companyId_idx" ON "User"("companyId");

-- CreateIndex
CREATE INDEX "User_teamId_idx" ON "User"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "AcquisitionOffer_userId_key" ON "AcquisitionOffer"("userId");

-- CreateIndex
CREATE INDEX "AcquisitionOffer_offeringCompanyId_idx" ON "AcquisitionOffer"("offeringCompanyId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageThread_offerId_key" ON "MessageThread"("offerId");

-- CreateIndex
CREATE INDEX "OfferMessage_receivingCompanyId_idx" ON "OfferMessage"("receivingCompanyId");

-- CreateIndex
CREATE INDEX "OfferMessage_sendingCompanyId_idx" ON "OfferMessage"("sendingCompanyId");

-- CreateIndex
CREATE INDEX "OfferMessage_threadId_idx" ON "OfferMessage"("threadId");

-- CreateIndex
CREATE INDEX "Team_companyId_idx" ON "Team"("companyId");

-- CreateIndex
CREATE INDEX "Project_companyId_idx" ON "Project"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserReferences_AB_unique" ON "_UserReferences"("A", "B");

-- CreateIndex
CREATE INDEX "_UserReferences_B_index" ON "_UserReferences"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyToIndustry_AB_unique" ON "_CompanyToIndustry"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyToIndustry_B_index" ON "_CompanyToIndustry"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanyCandidates_AB_unique" ON "_CompanyCandidates"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanyCandidates_B_index" ON "_CompanyCandidates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MessageThreadCompanies_AB_unique" ON "_MessageThreadCompanies"("A", "B");

-- CreateIndex
CREATE INDEX "_MessageThreadCompanies_B_index" ON "_MessageThreadCompanies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTeam_AB_unique" ON "_ProjectToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToTeam_B_index" ON "_ProjectToTeam"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToUser_AB_unique" ON "_ProjectToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToUser_B_index" ON "_ProjectToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionOffer" ADD CONSTRAINT "AcquisitionOffer_offeringCompanyId_fkey" FOREIGN KEY ("offeringCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionOffer" ADD CONSTRAINT "AcquisitionOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageThread" ADD CONSTRAINT "MessageThread_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "AcquisitionOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferMessage" ADD CONSTRAINT "OfferMessage_sendingCompanyId_fkey" FOREIGN KEY ("sendingCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferMessage" ADD CONSTRAINT "OfferMessage_receivingCompanyId_fkey" FOREIGN KEY ("receivingCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferMessage" ADD CONSTRAINT "OfferMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "MessageThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserReferences" ADD CONSTRAINT "_UserReferences_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserReferences" ADD CONSTRAINT "_UserReferences_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToIndustry" ADD CONSTRAINT "_CompanyToIndustry_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToIndustry" ADD CONSTRAINT "_CompanyToIndustry_B_fkey" FOREIGN KEY ("B") REFERENCES "Industry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyCandidates" ADD CONSTRAINT "_CompanyCandidates_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyCandidates" ADD CONSTRAINT "_CompanyCandidates_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageThreadCompanies" ADD CONSTRAINT "_MessageThreadCompanies_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageThreadCompanies" ADD CONSTRAINT "_MessageThreadCompanies_B_fkey" FOREIGN KEY ("B") REFERENCES "MessageThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTeam" ADD CONSTRAINT "_ProjectToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTeam" ADD CONSTRAINT "_ProjectToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
