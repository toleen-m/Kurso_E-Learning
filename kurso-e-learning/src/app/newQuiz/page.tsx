
import { redirect } from "next/navigation";
import { QuizForm } from "@/components/QuizForm";

export default async function NewQuizPage({searchParams} : {searchParams: Promise<{ leconId?: string}>}) {

    const params = await searchParams;
    const leconId = Number(params.leconId);

    if (!leconId) {
        return <p>Leçon introuvable.</p>;
    }
    
    return(
        <main>
            <h1>Cree un quiz </h1>
            <QuizForm leconId={leconId}/>
        </main>
    )
}