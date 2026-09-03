import prisma from "@/lib/prisma";

export default async function CorrectionQuestions({quizId}: {quizId: string}) {

    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId,
        },
        include: {
            questions: true,
        },
    });

    if (!quiz) {
        return <p>Quiz introuvable.</p>;
    }

    return (
        <div className="space-y-4">

            {quiz.questions.map((question, index) => (
                <div key={question.id} className="bg-white border border-slate-200 rounded-2xl p-6">
                    <p className="text-sm text-purple-600 font-medium">
                        Question {index + 1}
                    </p>

                    <h3 className="text-lg font-semibold text-slate-900 mt-2">
                        {question.enonce}
                    </h3>

                    <div className="mt-4">
                        <p className="font-medium text-green-600">
                            Bonne réponse :
                        </p>

                        <p className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3 text-green-800">
                            {question.bonneReponse}
                        </p>
                    </div>

                </div>
            ))}
        </div>
    );
}