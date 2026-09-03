import Link from "next/link";
import { getCurrentUser } from "@/actions/user.actions";
import prisma from "@/lib/prisma";

export default async function MesQuizPage() {
    const utilisateur = await getCurrentUser();

    if (!utilisateur) {
        return (
            <main className="max-w-5xl mx-auto p-8">

                <p className="mt-4 text-slate-500">
                    Vous devez être connecté pour voir vos quiz.
                </p>
            </main>
        );
    }

    const inscriptions = await prisma.inscription.findMany({
        where: {
            utilisateurId: utilisateur.id,
        },
        include: {
            cours: {
                include: {
                    lecons: {
                        include: {
                            quiz: {
                                include: {
                                    questions: true,
                                    quizFaits: {
                                        where: {
                                            utilisateurId: utilisateur.id,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    const quizFaits = [];
    const quizPasFaits = [];

    for (const inscription of inscriptions) {
        for (const lecon of inscription.cours.lecons) {
            for (const quiz of lecon.quiz) {
                if (quiz.quizFaits.length > 0) {
                    quizFaits.push({
                        quiz,
                        cours: inscription.cours,
                        lecon,
                    });
                } else {
                    quizPasFaits.push({
                        quiz,
                        cours: inscription.cours,
                        lecon,
                    });
                }
            }
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto p-8">

                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-slate-900">
                        Mes quiz
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Retrouve tous les quiz de tes cours.
                    </p>
                </div>


                <section className="mb-12">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Quiz pas faits
                        </h2>

                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                            {quizPasFaits.length}
                        </span>
                    </div>

                    {quizPasFaits.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <p className="text-slate-500">
                                Tu as fait tous les quiz disponibles.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {quizPasFaits.map((item) => (
                                <div key={item.quiz.id}className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                    <p className="text-sm text-purple-600 font-medium mb-2">
                                        {item.cours.titre}
                                    </p>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {item.quiz.titre}
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-2">
                                        Leçon : {item.lecon.titre}
                                    </p>

                                    <p className="text-sm text-slate-500 mt-2">
                                        {item.quiz.questions.length} questions
                                    </p>

                                    <Link href={`/cours/${item.cours.id}/lecons/${item.lecon.id}/quiz/${item.quiz.id}`}
                                        className="inline-block mt-5 bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-3 rounded-lg transition">
                                        Commencer le quiz
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Quiz faits
                        </h2>

                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            {quizFaits.length}
                        </span>
                    </div>

                    {quizFaits.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <p className="text-slate-500">
                                Tu n'as encore fait aucun quiz.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {quizFaits.map((item) => {
                                const resultat = item.quiz.quizFaits[0];

                                return (
                                    <div key={item.quiz.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                        <p className="text-sm text-purple-600 font-medium mb-2">
                                            {item.cours.titre}
                                        </p>

                                        <h3 className="text-xl font-bold text-slate-900">
                                            {item.quiz.titre}
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-2">
                                            Leçon : {item.lecon.titre}
                                        </p>

                                        <div className="mt-4">
                                            <p className="text-sm text-slate-500">
                                                Résultat
                                            </p>

                                            <p className="text-2xl font-bold text-green-600">
                                                {resultat.bonneReponse}/
                                                {resultat.totalQuestions}
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                Score : {resultat.score}%
                                            </p>
                                        </div>

                                        <Link href={`/cours/${item.cours.id}/lecons/${item.lecon.id}/quiz/${item.quiz.id}/correction`}
                                            className="inline-block mt-5 bg-slate-800 hover:bg-slate-900 text-white font-medium px-5 py-3 rounded-lg transition">
                                            Voir la correction
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}

