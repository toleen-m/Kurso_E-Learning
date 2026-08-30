"use client"

import { createQuiz } from "@/actions/quiz.actions"

export function QuizForm({leconId} : {leconId: number}){

    return(
        <form action={createQuiz}>
            <div>
                <label>Titre de votre quiz</label>
                <input name="titre" placeholder="Ex: Quiz JavaScript" required />
            </div>

            <div>
                <label>Le lecon a laquele vous assiocier ce quiz</label>
                <input name="leocnId" value={leconId}/>
            </div>

            <div>
                <button type="submit">
                    Créer le quiz
                </button>
            </div>
            
        </form>
    )
}