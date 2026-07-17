-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_leconId_fkey";

-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "leconId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_leconId_fkey" FOREIGN KEY ("leconId") REFERENCES "Lecon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
