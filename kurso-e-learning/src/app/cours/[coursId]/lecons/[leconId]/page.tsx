import Link from "next/link"
import { getCours } from "@/actions/cours.actions"
import CoursForm from "@/components/CoursForm"

export default async function CoursPage() {
  const cours = await getCours()

  return (
    <main>
      <h1>Liste des cours</h1>

      <section className="section">
        <h2>Créer un cours</h2>
        <CoursForm />
      </section>

      <section className="section">
        <h2>Cours disponibles</h2>

        {cours.length === 0 ? (
          <p>Aucun cours disponible.</p>
        ) : (
          <div>
            {cours.map((cours) => (
              <div key={cours.id} className="card">
                <h2>{cours.titre}</h2>

                <p>{cours.description}</p>

                <p className="info">
                  Niveau : {cours.niveau}
                </p>

                <p className="info">
                  Formateur : {cours.formateur.nom}
                </p>

                <p className="info">
                  {cours.lecons.length} leçon(s)
                </p>

                <Link href={`/cours/${cours.id}`}>
                  Voir le cours
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}