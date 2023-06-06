/*
  Warnings:

  - Added the required column `eventDate` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "canceled" BOOLEAN DEFAULT false,
ADD COLUMN     "eventDate" TIMESTAMP(3) NOT NULL;
