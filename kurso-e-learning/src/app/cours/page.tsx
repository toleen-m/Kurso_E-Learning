import Link from "next/link"
import { getCours } from "@/actions/cours.actions"
import CoursForm from "@/components/CoursForm"

export default async function CoursPage() {
  const cours = await getCours()

  return (
    <main>
      <h1>Liste des cours</h1>

      <h2>Créer un cours</h2>

      <CoursForm />

      {cours.length === 0 ? (
        <p>Aucun cours disponible.</p>
      ) : (
        <div>
          {cours.map((cours) => (
            <div key={cours.id}>
              <h2>{cours.titre}</h2>
              <p>{cours.description}</p>
              <p>Niveau : {cours.niveau}</p>
              <p>Formateur : {cours.formateur.nom}</p>
              <p>{cours.lecons.length} leçon(s)</p>

              <Link href={`/cours/${cours.id}`}>
                Voir le cours
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}