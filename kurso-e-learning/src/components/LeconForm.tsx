import { createLecon } from "@/actions/lecon.actions"

type Props = {
  coursId: string
}

export default function LeconForm({ coursId }: Props) {
  return (
    <form
      action={createLecon}
      className="space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6"
    >
      <input
        type="hidden"
        name="coursId"
        value={coursId}
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
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500"
          placeholder="Ex : Les variables en JavaScript"
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
          required
          rows={6}
          className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500"
          placeholder="Écrivez le contenu de la leçon..."
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
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700"
      >
        Ajouter la leçon
      </button>
    </form>
  )
}