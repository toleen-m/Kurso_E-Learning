
import Link from "next/link";
import { getCurrentUser } from "@/actions/user.actions";
import prisma from "@/lib/prisma";
import { deleteQuiz } from "@/actions/quiz.actions";


export default async function QuizPage({ params }:  {params: Promise<{coursId: string; leconId: string;}>}) {
    const { coursId, leconId } = await params;
    const utilisateur = await getCurrentUser();

    if(!utilisateur) {
        return (
            <h1 className="text-2xl font-bold text-slate-900"> Vous devez être connecté </h1>
        );
    }
    

    // chercher lecon et son cours
    const lecon = await prisma.lecon.findUnique({
        where: {
            id: leconId,
        },
        include: {
            cours: true,
            quiz: {
                include: {
                    questions: true,
                    quizFaits: {
                        where: {
                            utilisateurId: utilisateur.id
                        }
                    }
                },
                orderBy: {
                    id: "asc",
                },
            },
        },
    });

    if (!lecon || lecon.coursId !== coursId) {
        return (
            <div className="min-h-screen bg-slate-50 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8 text-center">
                    <h1 className="text-2xl font-bold text-red-600">
                        Leçon introuvable
                    </h1>

                </div>
            </div>
        );
    }

    // verifier formateur du cours = utilisateur
    const formateurDuCours = lecon.cours.formateurId === utilisateur.id;

    return (
        <main className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">

                <div className="flex flex-wrap gap-3 mb-6">
                    <Link href={`/cours/${coursId}/lecons/${leconId}`} className="text-sm text-slate-600 hover:text-purple-600">
                        ← Retour à la leçon
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                            <p className="text-3xl text-purple-600 font-medium">
                                {lecon.cours.titre}
                            </p>

                        </div>

                        {/* button cree = formateur */}
                        {formateurDuCours && (
                            <Link href={`/cours/${coursId}/lecons/${leconId}/newQuiz`}
                                className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-3 rounded-lg transition">
                                + Créer un quiz
                            </Link>
                        )}
                    </div>
                </div>
                


                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Tous les quiz
                    </h2>

                    <p className="text-slate-500 mt-1">
                        {lecon.quiz.length} quiz disponible(s)
                    </p>
                </div>

                {lecon.quiz.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                        <h3 className="text-xl font-semibold text-slate-800">
                            Aucun quiz trouver
                        </h3>

                        <p className="text-slate-500 mt-2">
                            Aucun quiz n'a encore été créé pour cette leçon.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">

                        {lecon.quiz.map((quiz, index) => (
                            <div key={quiz.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                                    <div>
                                        <p className="text-sm text-purple-600 font-medium">
                                            Quiz {index + 1}
                                        </p>

                                        <h3 className="text-xl font-bold text-slate-900 mt-1">
                                            {quiz.titre}
                                        </h3>

                                        <p className="text-slate-500 mt-2">
                                            {quiz.questions.length} questions
                                        </p>

                                        <p className="text-slate-500 mt-2">
                                            <strong className="text-purple-600">Score: </strong>
                                            {quiz.quizFaits.length > 0 ? `${quiz.quizFaits[0].bonneReponse}/${quiz.quizFaits[0].totalQuestions}` : "Pas encore fait"}
                                        </p>
                                    </div>

                                <div className="flex flex-wrap gap-2">


                                <Link href={`/cours/${coursId}/lecons/${leconId}/quiz/${quiz.id}`}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
                                    Faire le quiz
                                </Link>

                                {quiz.quizFaits.length > 0 && (
                                    <Link href={`/cours/${coursId}/lecons/${leconId}/quiz/${quiz.id}/correction`}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
                                        Voir la correction
                                    </Link>
                                )}

                                {/* buttons modifier et supprimer = Formateur */}
                                {formateurDuCours && (
                                    <>
                                        <form action={deleteQuiz}>
                                            <input type="hidden" name="id" value={quiz.id}/>
                                            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
                                                Supprimer
                                            </button>
                                        </form>
                                    </>
                                )}
                                </div>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </main>
    );
}

