import Link from "next/link"
import { getCoursById } from "@/actions/cours.actions"
import LeconForm from "@/components/LeconForm"

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
      <main>
        <h1>Cours introuvable</h1>
        <Link href="/cours">Retour aux cours</Link>
      </main>
    )
  }

  return (
    <main>
      <Link href="/cours">← Retour aux cours</Link>

      <h1>{cours.titre}</h1>

      <p>{cours.description}</p>
      <p>Niveau : {cours.niveau}</p>
      <p>Formateur : {cours.formateur.nom}</p>

      <h2>Leçons</h2>

      <LeconForm coursId={cours.id} />

      {cours.lecons.length === 0 ? (
        <p>Aucune leçon pour ce cours.</p>
      ) : (
        <div>
          {cours.lecons.map((lecon) => (
            <div key={lecon.id}>
              <h3>
                {lecon.ordre}. {lecon.titre}
              </h3>

              <Link href={`/cours/${cours.id}/lecons/${lecon.id}`}>
                Voir la leçon
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}