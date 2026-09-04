-- CreateTable
CREATE TABLE "LeconTerminee" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "leconId" TEXT NOT NULL,
    "termineeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeconTerminee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeconTerminee_utilisateurId_leconId_key" ON "LeconTerminee"("utilisateurId", "leconId");

-- AddForeignKey
ALTER TABLE "LeconTerminee" ADD CONSTRAINT "LeconTerminee_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeconTerminee" ADD CONSTRAINT "LeconTerminee_leconId_fkey" FOREIGN KEY ("leconId") REFERENCES "Lecon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
