import { createCours } from "@/actions/cours.actions"

export default function CoursForm() {
  return (
    <form action={createCours} className="form-container">
      <div className="form-group">
        <label htmlFor="titre">Titre</label>
        <input
          id="titre"
          name="titre"
          type="text"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="niveau">Niveau</label>
        <select
          id="niveau"
          name="niveau"
          defaultValue="DEBUTANT"
          required
        >
          <option value="DEBUTANT">Débutant</option>
          <option value="INTERMEDIAIRE">Intermédiaire</option>
          <option value="AVANCE">Avancé</option>
        </select>
      </div>

      <button type="submit">
        Créer le cours
      </button>
    </form>
  )
}