-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('COMPLETED', 'CANCELED', 'PLANNING');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'PLANNING';
