"use server"

import { GET } from "@/app/api/questions/route"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createQuiz(formData: FormData) {

    const response = await fetch(
        "http://localhost:3000/api/questions"
    );
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des questions");
    }
    const data = await response.json();
    

    const titre = formData.get("titre") as string;
    const leconId = Number(formData.get("leconId"));

    const quiz = await prisma.quiz.create({
        data:{
            titre: titre,
            leconId: leconId,
            score: 0,

            questions: {
                create: data.results.map((question: any ) => ({
                    enonce: question.question,
                    bonneReponse: question.correct_answer,
                    mauvaisesReponses: question.incorrect_answers,
                })),
            },
        },

        include: {
            questions: true,
        }
    })


    revalidatePath("/");
    revalidatePath("/newQuiz")

}