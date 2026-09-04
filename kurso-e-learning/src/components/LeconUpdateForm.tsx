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
    <form
      action={updateLecon}
      className="space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6"
    >
      <input
        type="hidden"
        name="id"
        value={lecon.id}
      />

      <div>
        <label
          htmlFor="titre"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Titre
        </label>

        <input
          id="titre"
          name="titre"
          type="text"
          defaultValue={lecon.titre}
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
        />
      </div>

      <div>
        <label
          htmlFor="contenu"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Contenu
        </label>

        <textarea
          id="contenu"
          name="contenu"
          defaultValue={lecon.contenu}
          required
          rows={6}
          className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
        />
      </div>

      <div>
        <label
          htmlFor="ordre"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Ordre
        </label>

        <input
          id="ordre"
          name="ordre"
          type="number"
          min="1"
          defaultValue={lecon.ordre}
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700"
      >
        Modifier la leçon
      </button>
    </form>
  )
}