"use server"

import { GET } from "@/app/api/questions/route"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


//!!!!!!!!!!!!!!!!!!!!! rewst de verifier l'utilisateur == FORMATEUR

export async function createQuiz(formData: FormData) {

    const response = await fetch("http://localhost:3000/api/questions");
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des questions");
    }
    const data = await response.json();
    

    const titre = formData.get("titre") as string;
    const leconId = formData.get("leconId") as string;

    const lecon = await prisma.lecon.findUnique({
        where: { id: leconId },
        include: { cours: true },
    });
    if (!lecon) throw new Error("Leçon introuvable.");

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


    revalidatePath(`/cours/${lecon.coursId}/lecons/${leconId}`);
    redirect(`/cours/${lecon.coursId}/lecons/${leconId}/quiz/${quiz.id}`);

}




export async function getQuiz(id : string) {
    
    const quiz = await prisma.quiz.findUnique({
        where: {
            id: id,
        },
        include: {
            questions: true,
            lecon: {
                include: { cours: true},
            }
        }
    });

    return quiz;

}



export async function updateQuiz(formData: FormData) {

    const id = formData.get("id") as string; 
    const titre = formData.get("titre") as string;

    const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: { 
            lecon: { 
                include: { cours: true } 
            }
        },
    });

    if (!quiz) throw new Error("Quiz introuvable.");

    await prisma.quiz.update({ 
        where: { 
            id: id, 
        }, 
        data: { 
            titre: titre, 
        }, 
    }); 
    
    revalidatePath(`/cours/${quiz.lecon.coursId}/lecons/${quiz.leconId}/quiz/${id}`); 
    redirect(`/cours/${quiz.lecon.coursId}/lecons/${quiz.leconId}`);


}



export async function deleteQuiz(formData: FormData) {
    const id = formData.get("id") as string; 

    const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: { 
            lecon: { 
                include: { cours: true } 
            } 
        },
    });

    if (!quiz) throw new Error("Quiz introuvable.");

    await prisma.quiz.delete({ 
        where: { 
            id: id, 
        }, 
    }); 
    
    revalidatePath(`/cours/${quiz.lecon.coursId}/lecons/${quiz.leconId}`); 
    redirect(`/cours/${quiz.lecon.coursId}/lecons/${quiz.leconId}`);

}