import Link from "next/link";
import { getQuiz, deleteQuiz } from "@/actions/quiz.actions";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/actions/user.actions";
import CorrectionQuestions from "@/components/CorrectionQuestions";

export default async function CorrectionPage({ params }: { params: Promise<{ coursId: string; leconId: string; quizId: string }> }) {
    const { coursId, leconId, quizId } = await params;
    const quiz = await getQuiz(quizId);

    if (!quiz || quiz.leconId !== leconId || quiz.lecon.coursId !== coursId) return <main className="p-10 text-center">Quiz introuvable.</main>;


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

    const formateurDuCours = lecon.cours.formateurId === utilisateur.id;

    const inscription = await prisma.inscription.findUnique({ 
        where: { 
            utilisateurId_coursId: { 
                utilisateurId: utilisateur.id, 
                coursId: coursId, 
            }
        }
    }); 
    // verifier si l'utilisateur est inscrit ou est le formateur du cours
    if (!formateurDuCours && !inscription) { 
        return ( 
            <main className="min-h-screen bg-slate-50 p-8"> 
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center"> 
                    
                    <h1 className="text-2xl font-bold text-red-600"> 
                        Accès refusé 
                    </h1> 
                    <p className="text-slate-500 mt-3">
                        Vous devez être inscrit à ce cours pour accéder aux quiz. 
                    </p> 
                    
                    <Link href="/cours" className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg transition" > 
                        Voir les cours 
                    </Link> 
                </div> 
            </main> 
        ); 
    }


    return (
        <main className="min-h-screen bg-slate-50 py-12">
            <div className="mx-auto max-w-4xl px-4">

                <Link href={`/cours/${coursId}/lecons/${leconId}/quiz`} className="text-sm font-medium text-purple-600">
                    ← Retour à la list des quiz
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

                {/* formulaire du correction */} 
                <CorrectionQuestions quizId={quizId} />

            </div>
        </main>
    );
}
