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
      <main>
        <h1>Leçon introuvable</h1>

        <Link href={`/cours/${coursId}`}>
          Retour au cours
        </Link>
      </main>
    )
  }

  return (
    <main>
      <Link
        href={`/cours/${coursId}`}
        className="back-link"
      >
        ← Retour au cours
      </Link>

      <div className="card">
        <h1>{lecon.titre}</h1>

        <p className="info">
          Leçon {lecon.ordre}
        </p>

        <p>{lecon.contenu}</p>
      </div>

      <section className="section">
        <h2>Modifier la leçon</h2>

        <LeconUpdateForm lecon={lecon} />
      </section>

      <section className="section">
        <h2>Supprimer la leçon</h2>

        <form action={deleteLecon}>
          <input
            type="hidden"
            name="id"
            value={lecon.id}
          />

          <button
            type="submit"
            className="danger-button"
          >
            Supprimer la leçon
          </button>
        </form>
      </section>

      <section className="section">
        <h2>Quiz</h2>

        {lecon.quiz.length === 0 ? (
          <p>Aucun quiz pour cette leçon.</p>
        ) : (
          <div>
            {lecon.quiz.map((quiz) => (
              <div key={quiz.id} className="card">
                <Link
                  href={`/cours/${coursId}/lecons/${leconId}/quiz/${quiz.id}`}
                >
                  {quiz.titre}
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}