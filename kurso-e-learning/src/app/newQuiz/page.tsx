
import { redirect } from "next/navigation";
import { QuizForm } from "@/components/QuizForm";

export default async function NewQuizPage({searchParams} : {searchParams: Promise<{ leocnId?: string}>}) {

    const params = await searchParams;
    const leconId = Number(params.leocnId);

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