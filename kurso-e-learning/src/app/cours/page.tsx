import Link from "next/link"
import { getCours } from "@/actions/cours.actions"
import { getCurrentUser } from "@/actions/user.actions"
import CoursForm from "@/components/CoursForm"

export default async function CoursPage() {
  const cours = await getCours()
  const utilisateur = await getCurrentUser()

  const estFormateur = utilisateur?.role === "FORMATEUR"

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl bg-slate-900 p-8 text-white">
          <p className="text-sm font-semibold text-purple-300">
            Catalogue
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Liste des cours
          </h1>

          <p className="mt-3 text-slate-400">
            Découvrez les cours disponibles et accédez aux différentes leçons.
          </p>
        </div>

        {estFormateur && (
          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-xl font-bold text-slate-900">
              Créer un cours
            </h2>

            <CoursForm />
          </section>
        )}

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Cours disponibles
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {cours.length} cours disponible(s)
            </p>
          </div>

          {cours.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-500">
                Aucun cours disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {cours.map((cours) => (
                <article
                  key={cours.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <p className="text-sm font-semibold text-purple-600">
                    {cours.niveau}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {cours.titre}
                  </h2>

                  <p className="mt-3 text-slate-600">
                    {cours.description}
                  </p>

                  <div className="mt-5 space-y-1 text-sm text-slate-500">
                    <p>
                      Formateur : {cours.formateur.nom}
                    </p>

                    <p>
                      {cours.lecons.length} leçon(s)
                    </p>
                  </div>

                  <Link
                    href={`/cours/${cours.id}`}
                    className="mt-5 inline-block rounded-lg bg-purple-600 px-4 py-2.5 font-semibold text-white hover:bg-purple-700"
                  >
                    Voir le cours
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}