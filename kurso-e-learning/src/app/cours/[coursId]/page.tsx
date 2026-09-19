import Link from "next/link"
import {
  deleteCours,
  getCoursById,
} from "@/actions/cours.actions"
import { getCurrentUser } from "@/actions/user.actions"
import { estInscrit } from "@/actions/inscription.actions"
import { BoutonInscription } from "@/components/BoutonInscription"
import { SuiviLecons } from "@/components/SuiviLecons"
import LeconForm from "@/components/LeconForm"
import CoursUpdateForm from "@/components/CoursUpdateForm"

type Props = {
  params: Promise<{
    coursId: string
  }>
}

export default async function CoursDetailPage({ params }: Props) {
  const { coursId } = await params
  const cours = await getCoursById(coursId)

  if (!cours) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Cours introuvable
          </h1>

          <Link
            href="/cours"
            className="mt-5 inline-block text-sm font-medium text-purple-600"
          >
            &larr; Retour aux cours
          </Link>
        </div>
      </main>
    )
  }

  const utilisateur = await getCurrentUser()

  const formateurDuCours =
    utilisateur?.id === cours.formateurId

  // Inscription 
  const inscription = await estInscrit(coursId)

  
  const peutConsulter = inscription !== null || formateurDuCours

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link
          href="/cours"
          className="text-sm font-medium text-purple-600"
        >
          &larr; Retour aux cours
        </Link>

        <div className="mt-6 rounded-2xl bg-slate-900 p-8 text-white">
          <p className="text-sm font-semibold text-purple-300">
            {cours.niveau}
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {cours.titre}
          </h1>

          <p className="mt-4 text-slate-300">
            {cours.description}
          </p>

          <p className="mt-4 text-sm text-slate-400">
            Formateur : {cours.formateur.nom}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            {cours.lecons.length} leçon(s)
          </p>

          {/* Bouton s'inscrire / se desinscrire */}
          {!formateurDuCours && (
            <div className="mt-6">
              <BoutonInscription coursId={cours.id} />
            </div>
          )}
        </div>

        {formateurDuCours && (
          <>
            <section className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-5 text-xl font-bold text-slate-900">
                  Modifier le cours
                </h2>

                <CoursUpdateForm cours={cours} />
              </div>

              <div className="rounded-2xl border border-red-200 bg-white p-6">
                <h2 className="font-bold text-slate-900">
                  Supprimer le cours
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Cette action supprimera définitivement le cours.
                </p>

                <form action={deleteCours} className="mt-5">
                  <input
                    type="hidden"
                    name="id"
                    value={cours.id}
                  />

                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </form>
              </div>
            </section>

            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Ajouter une leçon
              </h2>

              <LeconForm coursId={cours.id} />
            </section>
          </>
        )}

        
        <div className="mt-10">
          <SuiviLecons coursId={cours.id} />
        </div>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Leçons
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {cours.lecons.length} leçon(s)
            </p>
          </div>

          {cours.lecons.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-500">
                Aucune leçon pour ce cours.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cours.lecons.map((lecon) => (
                <div
                  key={lecon.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <p className="text-sm font-semibold text-purple-600">
                    Leçon {lecon.ordre}
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    {lecon.titre}
                  </h3>

                  
                  {peutConsulter ? (
                    <Link
                      href={`/cours/${cours.id}/lecons/${lecon.id}`}
                      className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2.5 font-semibold text-white hover:bg-purple-700"
                    >
                      Voir la leçon
                    </Link>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400">
                      Inscris-toi au cours pour accéder à cette leçon.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}