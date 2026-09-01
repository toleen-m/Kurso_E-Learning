/*
  Warnings:

  - The primary key for the `Cours` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DemandeFormateur` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Inscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Lecon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Quiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Utilisateur` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Cours" DROP CONSTRAINT "Cours_formateurId_fkey";

-- DropForeignKey
ALTER TABLE "DemandeFormateur" DROP CONSTRAINT "DemandeFormateur_utilisateurId_fkey";

-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_coursId_fkey";

-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_utilisateurId_fkey";

-- DropForeignKey
ALTER TABLE "Lecon" DROP CONSTRAINT "Lecon_coursId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_leconId_fkey";

-- AlterTable
ALTER TABLE "Cours" DROP CONSTRAINT "Cours_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "formateurId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Cours_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Cours_id_seq";

-- AlterTable
ALTER TABLE "DemandeFormateur" DROP CONSTRAINT "DemandeFormateur_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "utilisateurId" SET DATA TYPE TEXT,
ADD CONSTRAINT "DemandeFormateur_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DemandeFormateur_id_seq";

-- AlterTable
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "utilisateurId" SET DATA TYPE TEXT,
ALTER COLUMN "coursId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Inscription_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Inscription_id_seq";

-- AlterTable
ALTER TABLE "Lecon" DROP CONSTRAINT "Lecon_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "coursId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Lecon_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Lecon_id_seq";

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "quizId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Question_id_seq";

-- AlterTable
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "leconId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Quiz_id_seq";

-- AlterTable
ALTER TABLE "Utilisateur" DROP CONSTRAINT "Utilisateur_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Utilisateur_id_seq";

-- AddForeignKey
ALTER TABLE "DemandeFormateur" ADD CONSTRAINT "DemandeFormateur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cours" ADD CONSTRAINT "Cours_formateurId_fkey" FOREIGN KEY ("formateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "Cours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecon" ADD CONSTRAINT "Lecon_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "Cours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_leconId_fkey" FOREIGN KEY ("leconId") REFERENCES "Lecon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
