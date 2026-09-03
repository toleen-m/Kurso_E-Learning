import Link from "next/link"
import { getCours } from "@/actions/cours.actions"
import CoursForm from "@/components/CoursForm"

export default async function CoursPage() {
  const cours = await getCours()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-purple-400">
            Catalogue
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Liste des cours
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Découvrez les cours disponibles et accédez aux différentes leçons.
          </p>
        </div>

        <section className="mb-12 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-2xl font-semibold">
            Créer un cours
          </h2>

          <CoursForm />
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              Cours disponibles
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {cours.length} cours disponible(s)
            </p>
          </div>

          {cours.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                Aucun cours disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {cours.map((cours) => (
                <article
                  key={cours.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-purple-500"
                >
                  <div className="mb-4">
                    <span className="inline-block rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                      {cours.niveau}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-white">
                    {cours.titre}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {cours.description}
                  </p>

                  <div className="mt-5 space-y-2 text-sm text-slate-400">
                    <p>
                      Formateur :
                      <span className="ml-1 text-slate-200">
                        {cours.formateur.nom}
                      </span>
                    </p>

                    <p>
                      {cours.lecons.length} leçon(s)
                    </p>
                  </div>

                  <Link
                    href={`/cours/${cours.id}`}
                    className="mt-6 inline-block rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition hover:bg-purple-700"
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