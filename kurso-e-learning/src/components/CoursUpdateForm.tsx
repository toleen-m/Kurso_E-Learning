import { updateCours } from "@/actions/cours.actions"

type Props = {
  cours: {
    id: string
    titre: string
    description: string
    niveau: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE"
  }
}

export default function CoursUpdateForm({ cours }: Props) {
  return (
    <form action={updateCours}>
      <input
        type="hidden"
        name="id"
        value={cours.id}
      />

      <div>
        <label htmlFor="titre">Titre</label>
        <input
          id="titre"
          name="titre"
          type="text"
          defaultValue={cours.titre}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={cours.description}
          required
        />
      </div>

      <div>
        <label htmlFor="niveau">Niveau</label>
        <select
          id="niveau"
          name="niveau"
          defaultValue={cours.niveau}
          required
        >
          <option value="DEBUTANT">Débutant</option>
          <option value="INTERMEDIAIRE">Intermédiaire</option>
          <option value="AVANCE">Avancé</option>
        </select>
      </div>

      <button type="submit">
        Modifier le cours
      </button>
    </form>
  )
}