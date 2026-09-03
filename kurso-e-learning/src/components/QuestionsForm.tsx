import { getQuiz, submitQuiz } from "@/actions/quiz.actions";


export async function QuestionsForm({ params }: { params: Promise<{ coursId: string; leconId: string; quizId: string }> }) {
    const { coursId, leconId, quizId } = await params;
    const quiz = await getQuiz(quizId);
    
    if (!quiz || quiz.leconId !== leconId || quiz.lecon.coursId !== coursId) return <main className="p-10 text-center">Quiz introuvable.</main>;


    return (
        <form action={submitQuiz} className="mt-8 space-y-6" > 

            <input type="hidden" name="quizId" value={quiz.id} /> 
            {quiz.questions.map((question, index) => { 

                const reponses = [ question.bonneReponse, ...question.mauvaisesReponses, ].sort(() => Math.random() - 0.5); 
                return ( 
                    <div key={question.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" > 
                        <h2 className="font-bold text-slate-900"> 
                            Question {index + 1} 
                        </h2>
                        <p className="mt-3 text-lg text-slate-700"> 
                            {question.enonce} 
                        </p> 

                        <div className="mt-5 space-y-3"> 
                            {reponses.map( (reponse, responseIndex) => ( 
                                <label key={`${question.id}-${responseIndex}`} 
                                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-purple-400 hover:bg-purple-50" > 
                                    <input type="radio" name={question.id} value={reponse} 
                                        className="h-5 w-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 required" /> 
                                    <span className="text-slate-700"> 
                                        {reponse} 
                                    </span> 
                                </label> 
                            ))} 
                        </div> 
                    </div> 
                ); 
            })} 

            <div className="rounded-2xl border border-slate-200 bg-white p-6"> 
                <button type="submit" className="w-full rounded-xl bg-purple-600 px-6 py-4 font-bold text-white transition hover:bg-purple-700"> 
                    Soumettre le quiz 
                </button> 
            </div> 
        </form> 

    );

}