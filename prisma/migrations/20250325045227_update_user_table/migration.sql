/*
  Warnings:

  - Made the column `referralCode` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyPostCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dailyPostLimit" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "invitationLimit" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "lastPostCountReset" TIMESTAMP(3),
ADD COLUMN     "verificationCodeExpiry" TIMESTAMP(3),
ALTER COLUMN "referralCode" SET NOT NULL;

-- CreateTable
CREATE TABLE "UsedVerificationCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UsedVerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsedVerificationCode_userId_idx" ON "UsedVerificationCode"("userId");

-- CreateIndex
CREATE INDEX "UsedVerificationCode_code_idx" ON "UsedVerificationCode"("code");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_referralCode_idx" ON "User"("referralCode");

-- AddForeignKey
ALTER TABLE "UsedVerificationCode" ADD CONSTRAINT "UsedVerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
