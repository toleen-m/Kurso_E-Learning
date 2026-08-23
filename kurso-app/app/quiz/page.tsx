import { prisma } from "@/lib/prisma"

export default async function Page() {
    const quizs = await prisma.quiz.findMany()

    return(
        <>
            <h1>Liste de Quizs </h1>
            <ul>
                {quizs.map((q) => (
                    <li key={q.id}>
                        <a href={`quiz/${q.id}`}>{q.titre} : {q.score}</a>
                    </li>
                ))}
            </ul>

        </>
    )
    
}