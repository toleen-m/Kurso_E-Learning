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
      <main>
        <h1>Cours introuvable</h1>
        <Link href="/cours">Retour aux cours</Link>
      </main>
    )
  }

  return (
    <main>
      <Link href="/cours" className="back-link">
        ← Retour aux cours
      </Link>

      <div className="card">
        <h1>{cours.titre}</h1>

        <p>{cours.description}</p>

        <p className="info">
          Niveau : {cours.niveau}
        </p>

        <p className="info">
          Formateur : {cours.formateur.nom}
        </p>
      </div>

      <section className="section">
        <h2>Modifier le cours</h2>
        <CoursUpdateForm cours={cours} />
      </section>

      <section className="section">
        <h2>Supprimer le cours</h2>

        <form action={deleteCours}>
          <input
            type="hidden"
            name="id"
            value={cours.id}
          />

          <button
            type="submit"
            className="danger-button"
          >
            Supprimer le cours
          </button>
        </form>
      </section>

      <section className="section">
        <h2>Ajouter une leçon</h2>
        <LeconForm coursId={cours.id} />
      </section>

      <section className="section">
        <h2>Leçons</h2>

        {cours.lecons.length === 0 ? (
          <p>Aucune leçon pour ce cours.</p>
        ) : (
          <div>
            {cours.lecons.map((lecon) => (
              <div key={lecon.id} className="card">
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
      </section>
    </main>
  )
}