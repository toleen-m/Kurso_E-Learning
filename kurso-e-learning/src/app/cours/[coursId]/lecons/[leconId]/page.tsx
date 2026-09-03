import Link from "next/link"
import {
  deleteLecon,
  getLeconById,
} from "@/actions/lecon.actions"
import { getCurrentUser } from "@/actions/user.actions"
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

  if (!lecon || lecon.coursId !== coursId) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Leçon introuvable
          </h1>

          <Link
            href={`/cours/${coursId}`}
            className="mt-5 inline-block text-sm font-medium text-purple-600"
          >
            ← Retour au cours
          </Link>
        </div>
      </main>
    )
  }

  const utilisateur = await getCurrentUser()

  const formateurDuCours =
    utilisateur?.id === lecon.cours.formateurId

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link
          href={`/cours/${coursId}`}
          className="text-sm font-medium text-purple-600"
        >
          ← Retour au cours
        </Link>

        <div className="mt-6 rounded-2xl bg-slate-900 p-8 text-white">
          <p className="text-sm font-semibold text-purple-300">
            Leçon {lecon.ordre}
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {lecon.titre}
          </h1>

          <p className="mt-4 whitespace-pre-line text-slate-300">
            {lecon.contenu}
          </p>
        </div>

        {formateurDuCours && (
          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                Modifier la leçon
              </h2>

              <LeconUpdateForm lecon={lecon} />
            </div>

            <div className="rounded-2xl border border-red-200 bg-white p-6">
              <h2 className="font-bold text-slate-900">
                Supprimer la leçon
              </h2>

              <p className="mt-2 text-sm text-slate-500">
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
                  className="rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700"
                >
                  Supprimer
                </button>
              </form>
            </div>
          </section>
        )}

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Quiz
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {lecon.quiz.length} quiz disponible(s)
            </p>
          </div>

          <Link href={`/cours/${coursId}/lecons/${leconId}/quiz`}
              className="inline-block rounded-lg border border-purple-500 px-4 py-2 text-center text-sm font-medium text-purple-300 transition hover:bg-purple-600 hover:text-white">
              Voir les quizs
          </Link>
        </section>
      </div>
    </main>
  )
}