import { getCurrentUser } from "@/actions/user.actions"
import Link from "next/link"
import { getMesInscriptions, seDesinscrire } from "@/actions/inscription.actions"
import prisma from "@/lib/prisma"

export default async function ProfilPage({ 
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; page?: string }>;
}) {
  const params = await searchParams
  const statut = params.statut
  const page = Number(params.page) || 1
  const utilisateur = await getCurrentUser()
  const data = await getMesInscriptions(statut, page)

  
  if (!utilisateur) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4 text-slate-900">Mon profil</h1>
        <p className="text-slate-500">Connectez-vous pour accéder à votre profil.</p>
      </main>
    )
  }

  const DemandeFormateur = await prisma.demandeFormateur.findFirst({
    where: {
      utilisateurId: utilisateur.id,
    }
  })

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Mon profil</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-600 mb-5">Informations</h2>

        <div className="space-y-2">
          <p className="text-sm text-slate-500"><strong className="text-purple-600">Nom :</strong> {utilisateur.nom}</p>
          <p className="text-sm text-slate-500"><strong className="text-purple-600">Email :</strong> {utilisateur.email}</p>
          <p className="text-sm text-slate-500"><strong className="text-purple-600">Rôle :</strong> {utilisateur.role}</p>
        </div>
      </div>

      {utilisateur.role === "ETUDIANT" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-600 mb-5">Options étudiant</h2>

          <div className="space-y-3">
            <Link href="/cours" className="block text-purple-600 hover:underline">
              Voir mes cours
            </Link>

            <Link href="/profile/mesQuiz" className="block text-purple-600 hover:underline">
              Voir mes quiz
            </Link>

            {DemandeFormateur?.statut === "EN_ATTENTE" && (
              <p className="text-sm text-green-500">
                Votre demande de devenir formateur est en attente.
              </p>
            )}
            {DemandeFormateur?.statut === "REFUSEE" && (
              <p className="text-sm text-red-500">
                Votre demande de devenir formateur a été refusée.
              </p>
            )}
            {!DemandeFormateur && (
              <Link href="/profile/demandeFormateur" className="block text-purple-600 hover:underline">
                Demander à devenir formateur
              </Link>
            )}
          </div>
        </div>
      )}

      {utilisateur.role === "FORMATEUR" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-600 mb-5">Options formateur</h2>

          <div className="space-y-3">

            <Link href="/cours" className="block text-purple-600 hover:underline">
              Voir mes cours
            </Link>

            <Link href="/profile/mesQuiz" className="block text-purple-600 hover:underline">
              Voir mes quiz
            </Link>

            <Link href="/cours" className="block text-purple-600 hover:underline">
              Mes cours créés
            </Link>

            <Link
              href="/cours"
              className="block text-purple-600 hover:underline"
            >
              Créer un cours
            </Link>
          </div>
        </div>
      )}

      {utilisateur.role === "ADMIN" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-600 mb-5">Administration</h2>

            <div className="space-y-3">

                <Link href="/cours" className="block text-purple-600 hover:underline">
                    Voir mes cours
                </Link>

                <Link href="/profile/mesQuiz" className="block text-purple-600 hover:underline">
                    Voir mes quiz
                </Link>
                
                <Link href="/cours" className="block text-purple-600 hover:underline">
                    Mes cours créés
                </Link>

                <Link
                    href="/cours"
                    className="block text-purple-600 hover:underline"
                >
                    Créer un cours
                </Link>

                <Link href="/profile/gererDemandes" className="block text-purple-600 hover:underline">
                    Gérer les demandes de formateur
                </Link>
            </div>
        </div>
      )}
      
              {/* ---------- Mes cours inscrits ---------- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

          <h2 className="text-xl font-bold text-gray-600 mb-5">
            Mes cours inscrits ({data ? data.total : 0})
          </h2>

          <div className="flex gap-2 mb-5">
            <Link href="/profile" className="rounded-full bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">
              Tous
            </Link>
            <Link href="/profile?statut=EN_COURS" className="rounded-full bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">
              En cours
            </Link>
            <Link href="/profile?statut=TERMINE" className="rounded-full bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300">
              Terminés
            </Link>
          </div>

          {!data || data.inscriptions.length === 0 ? (
            <p className="text-slate-500">Aucun cours dans cette catégorie.</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {data.inscriptions.map((inscription) => (
                <li key={inscription.id} className="rounded-lg border border-slate-200 p-5">

                  <Link href={`/cours/${inscription.coursId}`} className="font-semibold hover:text-purple-600">
                    {inscription.cours.titre}
                  </Link>

                  <p className="mt-1 text-sm text-slate-500">
                    {inscription.cours.formateur.nom} · {inscription.cours.lecons.length} leçon(s)
                  </p>

                  <div className="mt-4">
                    <p className="mb-1 text-xs text-slate-500">
                      Progression : {inscription.progression}% ({inscription.statut})
                    </p>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-purple-600"
                        style={{ width: `${inscription.progression}%` }}
                      />
                    </div>
                  </div>

                  <form action={seDesinscrire} className="mt-4">
                    <input type="hidden" name="inscriptionId" value={inscription.id} />
                    <button type="submit" className="text-sm text-slate-500 underline hover:text-red-600">
                      Se désinscrire
                    </button>
                  </form>

                </li>
              ))}
            </ul>
          )}

          {data && data.pages > 1 && (
            <div className="mt-6 flex gap-2">
              {Array.from({ length: data.pages }).map((_, i) => (
                <Link
                  key={i}
                  href={statut ? `/profile?statut=${statut}&page=${i + 1}` : `/profile?page=${i + 1}`}
                  className="rounded bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300"
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          )}

        </div>

    </main>
  )

} 