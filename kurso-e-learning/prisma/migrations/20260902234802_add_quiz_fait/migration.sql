/*
  Warnings:

  - You are about to drop the column `score` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "score";

-- CreateTable
CREATE TABLE "QuizFait" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "bonneReponse" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizFait_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizFait_utilisateurId_quizId_key" ON "QuizFait"("utilisateurId", "quizId");

-- AddForeignKey
ALTER TABLE "QuizFait" ADD CONSTRAINT "QuizFait_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizFait" ADD CONSTRAINT "QuizFait_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
