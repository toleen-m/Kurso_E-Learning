import Link from "next/link"
import { getLeconById } from "@/actions/lecon.actions"

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
        <Link href={`/cours/${coursId}`}>Retour au cours</Link>
      </main>
    )
  }

  return (
    <main>
      <Link href={`/cours/${coursId}`}>← Retour au cours</Link>

      <h1>{lecon.titre}</h1>
      <p>Leçon {lecon.ordre}</p>

      <div>
        <p>{lecon.contenu}</p>
      </div>

      <h2>Quiz</h2>

      {lecon.quiz.length === 0 ? (
        <p>Aucun quiz pour cette leçon.</p>
      ) : (
        <div>
          {lecon.quiz.map((quiz) => (
            <div key={quiz.id}>
              <Link
                href={`/cours/${coursId}/lecons/${leconId}/quiz/${quiz.id}`}
              >
                {quiz.titre}
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}