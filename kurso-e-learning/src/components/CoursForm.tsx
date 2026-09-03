import { createCours } from "@/actions/cours.actions"

export default function CoursForm() {
  return (
    <form action={createCours} className="space-y-5">
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
          placeholder="Ex : Introduction à JavaScript"
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
          required
          rows={5}
          className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-purple-500"
          placeholder="Décrivez le contenu du cours..."
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
          defaultValue="DEBUTANT"
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
        Créer le cours
      </button>
    </form>
  )
}