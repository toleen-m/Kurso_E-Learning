import Link from "next/link"
import { QuizForm } from "@/components/QuizForm";
import { getCurrentUser } from "@/actions/user.actions";
import prisma from "@/lib/prisma";

export default async function NewQuizPage({ params }: { params: Promise<{ coursId: string; leconId: string }> }) {

    const { coursId, leconId } = await params;

    const utilisateur = await getCurrentUser();
    if(!utilisateur) {
        return (
            <h1 className="text-2xl font-bold text-slate-900"> Vous devez être connecté </h1>
        );
    }

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

    if (!formateurDuCours) { 
        return ( 
            <main className="min-h-screen bg-slate-50 p-8"> 
                <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm"> 
                    <h1 className="text-2xl font-bold text-red-600"> 
                        Accès refusé 
                    </h1> 
                    <p className="mt-3 text-slate-500"> 
                        Vous devez être le formateur de ce cours pour créer un quiz. 
                    </p> 
                    <Link href={`/cours/${coursId}/lecons/${leconId}/quiz`} 
                        className="mt-6 inline-block rounded-lg bg-purple-600 px-5 py-3 text-white transition hover:bg-purple-700" > 
                        Retour aux quiz 
                    </Link> 
                </div> 
            </main> 
        ); 
    }

    return(
        <main className="min-h-screen bg-slate-50 py-12">
            <div className="mx-auto max-w-2xl px-4">
                <Link href={`/cours/${coursId}/lecons/${leconId}/quiz`} className="text-sm font-medium text-purple-600">
                    ← Retour à la list des quiz
                </Link>

                <h1 className="mt-4 text-3xl font-bold text-slate-900">
                    Créer un quiz
                </h1>

                <QuizForm leconId={leconId} />
            </div>
        </main>
    )
}