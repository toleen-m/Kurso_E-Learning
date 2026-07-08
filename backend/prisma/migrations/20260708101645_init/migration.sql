-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ETUDIANT', 'FORMATEUR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Niveau" AS ENUM ('DEBUTANT', 'INTERMEDIAIRE', 'AVANCE');

-- CreateEnum
CREATE TYPE "Statut" AS ENUM ('EN_COURS', 'TERMINE', 'ABANDONNE');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ETUDIANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cours" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "niveau" "Niveau" NOT NULL DEFAULT 'DEBUTANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscription" (
    "id" SERIAL NOT NULL,
    "statut" "Statut" NOT NULL DEFAULT 'EN_COURS',
    "progression" DOUBLE PRECISION NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "coursId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lecon" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL,
    "coursId" INTEGER NOT NULL,

    CONSTRAINT "Lecon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "leconId" INTEGER NOT NULL,
    "questions" TEXT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cours_titre_key" ON "Cours"("titre");

-- CreateIndex
CREATE UNIQUE INDEX "Inscription_utilisateurId_coursId_key" ON "Inscription"("utilisateurId", "coursId");

-- CreateIndex
CREATE UNIQUE INDEX "Lecon_coursId_titre_key" ON "Lecon"("coursId", "titre");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_questions_key" ON "Quiz"("questions");

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "Cours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecon" ADD CONSTRAINT "Lecon_coursId_fkey" FOREIGN KEY ("coursId") REFERENCES "Cours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_leconId_fkey" FOREIGN KEY ("leconId") REFERENCES "Lecon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
