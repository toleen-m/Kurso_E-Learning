import Link from "next/link"
import {
  deleteCours,
  getCoursById,
} from "@/actions/cours.actions"
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
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold">
            Cours introuvable
          </h1>

          <Link
            href="/cours"
            className="mt-6 inline-block text-purple-400 transition hover:text-purple-300"
          >
            ← Retour aux cours
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-10">
        <Link
          href="/cours"
          className="mb-8 inline-block text-sm text-purple-400 transition hover:text-purple-300"
        >
          ← Retour aux cours
        </Link>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <span className="inline-block rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
            {cours.niveau}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-white">
            {cours.titre}
          </h1>

          <p className="mt-4 leading-7 text-slate-400">
            {cours.description}
          </p>

          <p className="mt-4 text-sm text-slate-400">
            Formateur :
            <span className="ml-1 text-slate-200">
              {cours.formateur.nom}
            </span>
          </p>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-semibold">
            Modifier le cours
          </h2>

          <CoursUpdateForm cours={cours} />
        </section>

        <section className="mt-10 rounded-xl border border-red-900/50 bg-red-950/20 p-6">
          <h2 className="text-xl font-semibold text-red-300">
            Supprimer le cours
          </h2>

          <p className="mt-2 text-sm text-slate-400">
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
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
            >
              Supprimer le cours
            </button>
          </form>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-semibold">
            Ajouter une leçon
          </h2>

          <LeconForm coursId={cours.id} />
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              Leçons
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {cours.lecons.length} leçon(s)
            </p>
          </div>

          {cours.lecons.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                Aucune leçon pour ce cours.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cours.lecons.map((lecon) => (
                <article
                  key={lecon.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm text-purple-400">
                      Leçon {lecon.ordre}
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-white">
                      {lecon.titre}
                    </h3>
                  </div>

                  <Link
                    href={`/cours/${cours.id}/lecons/${lecon.id}`}
                    className="inline-block rounded-lg border border-purple-500 px-4 py-2 text-center text-sm font-medium text-purple-300 transition hover:bg-purple-600 hover:text-white"
                  >
                    Voir la leçon
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