"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./user.actions";


export async function createQuiz(formData: FormData) {

    //api
    const response = await fetch("http://localhost:3000/api/questions");
    if (!response.ok) {
        throw new Error("Erreur lors de la recuperation des questions");
    }
    const data = await response.json();

    //verification connexion et role
    const utilisateur = await getCurrentUser();
    if (!utilisateur) throw new Error("Vous n'etes pas connecter");
    if(utilisateur.role == "ETUDIANT") throw new Error("Vous n'est pas un formateur, faites une demende pour changer acces.");
    

    const titre = formData.get("titre") as string;
    const leconId = formData.get("leconId") as string;

    // verifder la lecon
    const lecon = await prisma.lecon.findUnique({
        where: { id: leconId },
        include: { cours: true },
    });
    if (!lecon) throw new Error("Lecon introuvable.");


    //verifier le formateur du cours = utilisateur
    if (lecon.cours.formateurId !== utilisateur.id) throw new Error("Vous ne pouvez pas creer un quiz dans ce cours");

    const quiz = await prisma.quiz.create({
        data:{
            titre: titre,
            leconId: leconId,

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
    });


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

    const utilisateur = await getCurrentUser();
    if (!utilisateur) throw new Error("Vous n'etes pas connecter");
    if(utilisateur.role == "ETUDIANT") throw new Error("Vous n'est pas un formateur, faites une demende pour changer acces.");
    

    const id = formData.get("id") as string; 
    const titre = formData.get("titre") as string;

    //verfier que le cours existe
    const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: { 
            lecon: { 
                include: { cours: true } 
            }
        },
    });
    if (!quiz) throw new Error("Quiz introuvable.");

    //verifier le formateur du cours = utilisateur
    if (quiz.lecon.cours.formateurId !== utilisateur.id) throw new Error("Vous ne pouvez pas modifier ce quiz.")

    await prisma.quiz.update({ 
        where: { 
            id: id, 
        }, 
        data: { 
            titre: titre, 
        }, 
    }); 
    
    revalidatePath(`/cours/${quiz.lecon.coursId}/lecons/${quiz.leconId}/quiz/${id}`); 
    redirect(`/cours/${quiz.lecon.coursId}/lecons/${quiz.leconId}/quiz/${id}`);


}



export async function deleteQuiz(formData: FormData) {

    const utilisateur = await getCurrentUser();
    if (!utilisateur) throw new Error("Vous n'etes pas connecter");
    if(utilisateur.role == "ETUDIANT") throw new Error("Vous n'est pas un formateur, faites une demende pour changer acces.");

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

    if (quiz.lecon.cours.formateurId !== utilisateur.id) {
        throw new Error("Vous ne pouvez pas supprimer ce quiz.");
    }

    await prisma.quiz.delete({ 
        where: { 
            id: id, 
        }, 
    }); 
    
    revalidatePath(`/cours/${quiz.lecon.coursId}/lecons/${quiz.leconId}/quiz`); 
    redirect(`/cours/${quiz.lecon.coursId}/lecons/${quiz.leconId}/quiz`);

}



export async function submitQuiz(formData: FormData) { 
    const quizId = formData.get("quizId") as string; 
    
    if (!quizId) throw new Error("Quiz introuvable.");

    const utilisateur = await getCurrentUser();
    if (!utilisateur) throw new Error("Vous n'etes pas connecter");
    
    const quiz = await prisma.quiz.findUnique({ 
        where: { 
            id: quizId, 
        }, 
        include: { 
            questions: true, 
            lecon: { 
                include: { 
                    cours: true, 
                }
            }
        }
    }); 
    
    if (!quiz) throw new Error("Quiz introuvable."); 
    
    let bonnesReponses = 0; 
    for (const question of quiz.questions) { 
        const reponsesUtilisateur = formData.get(question.id); 
        
        if ( reponsesUtilisateur === question.bonneReponse ) { 
            bonnesReponses++; 
        } 
    } 
    
    const totalQuestions = quiz.questions.length;
    const score = totalQuestions > 0 ? (bonnesReponses / totalQuestions) * 100 : 0;
    
    await prisma.quizFait.upsert({
        where: {
            utilisateurId_quizId: {
                utilisateurId: utilisateur.id,
                quizId: quiz.id,
            },
        },
        update: {
            score: score,
            bonneReponse: bonnesReponses,
            totalQuestions: totalQuestions,
        },
        create: {
            utilisateurId: utilisateur.id,
            quizId: quiz.id,
            score: score,
            bonneReponse: bonnesReponses,
            totalQuestions: totalQuestions,
        },
    });
    
    revalidatePath( `/cours/${quiz.lecon.coursId}/lecons/${quiz.leconId}/quiz` ); 
    redirect( `/cours/${quiz.lecon.coursId}/lecons/${quiz.leconId}/quiz`); 
}