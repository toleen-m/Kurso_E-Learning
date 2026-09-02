import { createLecon } from "@/actions/lecon.actions"

type Props = {
  coursId: string
}

export default function LeconForm({ coursId }: Props) {
  return (
    <form action={createLecon}>
      <input
        type="hidden"
        name="coursId"
        value={coursId}
      />

      <div>
        <label htmlFor="titre">Titre</label>
        <input
          id="titre"
          name="titre"
          type="text"
          required
        />
      </div>

      <div>
        <label htmlFor="contenu">Contenu</label>
        <textarea
          id="contenu"
          name="contenu"
          required
        />
      </div>

      <div>
        <label htmlFor="ordre">Ordre</label>
        <input
          id="ordre"
          name="ordre"
          type="number"
          min="1"
          required
        />
      </div>

      <button type="submit">
        Ajouter la leçon
      </button>
    </form>
  )
}