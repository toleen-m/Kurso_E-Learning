import { createQuiz } from "@/actions/quiz.actions";

export function QuizForm({ leconId }: { leconId: string }) {
  return (
    <form action={createQuiz} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <input type="hidden" name="leconId" value={leconId} />
        <div>
            <label htmlFor="titre" className="mb-2 block text-sm font-semibold text-slate-700">
                Titre du quiz
            </label>
            <input id="titre" name="titre" placeholder="Ex: Quiz JavaScript" required className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
        </div>
        <p className="text-sm text-slate-500">
            5 questions à choix multiple seront générées automatiquement.
        </p>
        <button type="submit" className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700">
            Créer le quiz
        </button>
    </form>
  );
}