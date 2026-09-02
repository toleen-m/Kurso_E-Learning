import { updateLecon } from "@/actions/lecon.actions"

type Props = {
  lecon: {
    id: string
    titre: string
    contenu: string
    ordre: number
  }
}

export default function LeconUpdateForm({ lecon }: Props) {
  return (
    <form action={updateLecon}>
      <input
        type="hidden"
        name="id"
        value={lecon.id}
      />

      <div>
        <label htmlFor="titre">Titre</label>
        <input
          id="titre"
          name="titre"
          type="text"
          defaultValue={lecon.titre}
          required
        />
      </div>

      <div>
        <label htmlFor="contenu">Contenu</label>
        <textarea
          id="contenu"
          name="contenu"
          defaultValue={lecon.contenu}
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
          defaultValue={lecon.ordre}
          required
        />
      </div>

      <button type="submit">
        Modifier la leçon
      </button>
    </form>
  )
}