import Link from "next/link"
import {
  deleteLecon,
  getLeconById,
} from "@/actions/lecon.actions"
import LeconUpdateForm from "@/components/LeconUpdateForm"

type Props = {
  params: Promise<{
    coursId: string
    leconId: string
  }>
}

export default async function LeconPage({ params }: Props) {
  const { coursId, leconId } = await params
  const lecon = await getLeconById(leconId)

  if (!lecon) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold">
            Leçon introuvable
          </h1>

          <Link
            href={`/cours/${coursId}`}
            className="mt-6 inline-block text-purple-400 transition hover:text-purple-300"
          >
            ← Retour au cours
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-10">
        <Link
          href={`/cours/${coursId}`}
          className="mb-8 inline-block text-sm text-purple-400 transition hover:text-purple-300"
        >
          ← Retour au cours
        </Link>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <span className="inline-block rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
            Leçon {lecon.ordre}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-white">
            {lecon.titre}
          </h1>

          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/50 p-5">
            <p className="whitespace-pre-line leading-7 text-slate-300">
              {lecon.contenu}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-semibold">
            Modifier la leçon
          </h2>

          <LeconUpdateForm lecon={lecon} />
        </section>

        <section className="mt-10 rounded-xl border border-red-900/50 bg-red-950/20 p-6">
          <h2 className="text-xl font-semibold text-red-300">
            Supprimer la leçon
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Cette action supprimera définitivement la leçon.
          </p>

          <form action={deleteLecon} className="mt-5">
            <input
              type="hidden"
              name="id"
              value={lecon.id}
            />

            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
            >
              Supprimer la leçon
            </button>
          </form>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              Quiz
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {lecon.quiz.length} quiz disponible(s)
            </p>
          </div>

          {lecon.quiz.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
              <p className="text-slate-400">
                Aucun quiz pour cette leçon.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {lecon.quiz.map((quiz) => (
                <article
                  key={quiz.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm text-purple-400">
                      Quiz
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-white">
                      {quiz.titre}
                    </h3>
                  </div>

                  <Link
                    href={`/cours/${coursId}/lecons/${leconId}/quiz/${quiz.id}`}
                    className="inline-block rounded-lg border border-purple-500 px-4 py-2 text-center text-sm font-medium text-purple-300 transition hover:bg-purple-600 hover:text-white"
                  >
                    Voir le quiz
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