-- CreateEnum
CREATE TYPE "StatutDemande" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE');

-- CreateTable
CREATE TABLE "DemandeFormateur" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "motivation" TEXT NOT NULL,
    "expertise" TEXT NOT NULL,
    "statut" "StatutDemande" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemandeFormateur_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DemandeFormateur" ADD CONSTRAINT "DemandeFormateur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
