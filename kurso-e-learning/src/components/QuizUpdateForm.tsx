import { updateQuiz } from "@/actions/quiz.actions";

export default function QuizUpdateForm({ id, titre }: { id: string; titre: string }) {
  return (
    <form action={updateQuiz} className="space-y-4">

        <input type="hidden" name="id" value={id} />

        <div>
            <label htmlFor="titre" className="mb-2 block text-sm font-medium text-slate-700">
                Titre du quiz
            </label>
            <input id="titre" type="text" name="titre" defaultValue={titre} required className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
        </div>

        <button type="submit" className="rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white hover:bg-purple-700">
            Modifier le quiz
        </button>
    </form>
  );
}
