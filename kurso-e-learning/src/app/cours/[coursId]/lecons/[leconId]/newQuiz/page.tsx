
import Link from "next/link"
import { QuizForm } from "@/components/QuizForm";

export default async function NewQuizPage({ params }: { params: Promise<{ coursId: string; leconId: string }> }) {

    const { coursId, leconId } = await params;

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