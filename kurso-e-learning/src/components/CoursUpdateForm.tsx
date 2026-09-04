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
    <form
      action={updateCours}
      className="space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6"
    >
      <input
        type="hidden"
        name="id"
        value={cours.id}
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
          defaultValue={cours.titre}
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          defaultValue={cours.description}
          required
          rows={5}
          className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
        />
      </div>

      <div>
        <label
          htmlFor="niveau"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Niveau
        </label>

        <select
          id="niveau"
          name="niveau"
          defaultValue={cours.niveau}
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-500"
        >
          <option value="DEBUTANT">Débutant</option>
          <option value="INTERMEDIAIRE">Intermédiaire</option>
          <option value="AVANCE">Avancé</option>
        </select>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-purple-600 px-5 py-3 font-medium text-white transition hover:bg-purple-700"
      >
        Modifier le cours
      </button>
    </form>
  )
}