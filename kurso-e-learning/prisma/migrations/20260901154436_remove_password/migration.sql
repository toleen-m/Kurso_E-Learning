/*
  Warnings:

  - You are about to drop the column `password` on the `Utilisateur` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "password",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
