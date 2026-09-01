import Link from "next/link";
import { getQuiz, deleteQuiz } from "@/actions/quiz.actions";
import QuizUpdateForm from "@/components/QuizUpdateForm";

export default async function QuizPage({ params }: { params: Promise<{ coursId: string; leconId: string; quizId: string }> }) {
    const { coursId, leconId, quizId } = await params;
    const quiz = await getQuiz(quizId);

    if (!quiz || quiz.leconId !== leconId || quiz.lecon.coursId !== coursId) return <main className="p-10 text-center">Quiz introuvable.</main>;

    return (
        <main className="min-h-screen bg-slate-50 py-12">
            <div className="mx-auto max-w-4xl px-4">

                <Link href={`/cours/${coursId}/lecons/${leconId}`} className="text-sm font-medium text-purple-600">
                    ← Retour à la leçon
                </Link>

                <div className="mt-6 rounded-2xl bg-slate-900 p-8 text-white">

                    <p className="text-sm font-semibold text-purple-300">
                        Quiz
                    </p>
                    <h1 className="mt-2 text-4xl font-bold">
                        {quiz.titre}
                    </h1>
                    <p className="mt-2 text-slate-400">
                        {quiz.questions.length} questions
                    </p>
                </div>

                <section className="mt-8 space-y-5">
                    {quiz.questions.map((question, index) => {
                        const reponses = [question.bonneReponse, ...question.mauvaisesReponses];
                        return (
                            <div key={question.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <h2 className="font-bold text-slate-900">
                                    Question {index + 1}
                                </h2>

                                <p className="mt-3 text-slate-700">
                                    {question.enonce}
                                </p>

                                <div className="mt-5 grid gap-3">
                                    {reponses.map((reponse, responseIndex) => (
                                        <div key={`${question.id}-${responseIndex}`} className={`rounded-lg border p-3 ${responseIndex === 0 ? "border-green-200 bg-green-50 text-green-800" : "border-slate-200 text-slate-700"}`}>
                                            {reponse}
                                        </div>
                                    ))}
                                </div>

                            </div>
                        );
                    })}
                </section>

                <section className="mt-10 grid gap-6 md:grid-cols-2">
                    
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <h2 className="mb-5 text-xl font-bold text-slate-900">
                            Modifier le quiz
                        </h2>

                        <QuizUpdateForm id={quiz.id} titre={quiz.titre} />

                    </div>

                    <div className="rounded-2xl border border-red-200 bg-white p-6">

                        <h2 className="font-bold text-slate-900">
                            Supprimer le quiz
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Les questions seront supprimées avec le quiz.
                        </p>

                        <form action={deleteQuiz} className="mt-5">
                            <input type="hidden" name="id" value={quiz.id} />

                            <button className="rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700">
                                Supprimer
                            </button>
                        </form>

                    </div>

                </section>
            </div>
        </main>
    );
}
