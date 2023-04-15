/*
  Warnings:

  - Added the required column `clientId` to the `Planner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registeredById` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Planner" ADD COLUMN     "clientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "registeredById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Planner" ADD CONSTRAINT "Planner_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
