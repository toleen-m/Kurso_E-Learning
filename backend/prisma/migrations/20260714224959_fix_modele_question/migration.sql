/*
  Warnings:

  - You are about to drop the column `reponse` on the `Question` table. All the data in the column will be lost.
  - Added the required column `bonneReponse` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "reponse",
ADD COLUMN     "bonneReponse" TEXT NOT NULL,
ADD COLUMN     "mauvaisesReponses" TEXT[];
