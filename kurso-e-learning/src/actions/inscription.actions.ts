"use server"

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/actions/user.actions";
import { revalidatePath } from "next/cache";


// ---------- S'inscrire à un cours ----------

export async function sInscrire(formData: FormData) {

    const coursId = formData.get("coursId") as string;

    const utilisateur = await getCurrentUser();
    if (!utilisateur) throw new Error("Tu dois être connecté pour t'inscrire.");

    const cours = await prisma.cours.findUnique({
        where: { id: coursId },
    });
    if (!cours) throw new Error("Cours introuvable.");

    const dejaInscrit = await prisma.inscription.findFirst({
        where: {
            utilisateurId: utilisateur.id,
            coursId: coursId,
        },
    });
    if (dejaInscrit) throw new Error("Tu es déjà inscrit à ce cours.");

    await prisma.inscription.create({
        data: {
            utilisateurId: utilisateur.id,
            coursId: coursId,
            progression: 0,
            statut: "EN_COURS",
        },
    });

    revalidatePath(`/cours/${coursId}`);
    revalidatePath("/profile");
}


// ---------- Se désinscrire --------

export async function seDesinscrire(formData: FormData) {

    const inscriptionId = formData.get("inscriptionId") as string;

    const utilisateur = await getCurrentUser();
    if (!utilisateur) throw new Error("Tu dois être connecté.");

    const inscription = await prisma.inscription.findUnique({
        where: { id: inscriptionId },
    });
    if (!inscription) throw new Error("Inscription introuvable.");

    
    if (inscription.utilisateurId !== utilisateur.id) {
        throw new Error("Accès interdit.");
    }

    
    await prisma.leconTerminee.deleteMany({
        where: {
            utilisateurId: utilisateur.id,
            lecon: { coursId: inscription.coursId },
        },
    });

    await prisma.inscription.delete({
        where: { id: inscriptionId },
    });

    revalidatePath(`/cours/${inscription.coursId}`);
    revalidatePath("/profile");
}


// ---------- Voir ses cours inscrits (filtre + pagination) ----------

export async function getMesInscriptions(statut?: string, page: number = 1) {

    const utilisateur = await getCurrentUser();
    if (!utilisateur) return null;

    const parPage = 6;

    
    const statutsValides = ["EN_COURS", "TERMINE", "ABANDONNE"];
    const statutFiltre =
        statut && statutsValides.includes(statut) ? statut : undefined;

    const pageValide = page > 0 ? page : 1;

    const filtre = {
        utilisateurId: utilisateur.id,
        ...(statutFiltre
            ? { statut: statutFiltre as "EN_COURS" | "TERMINE" | "ABANDONNE" }
            : {}),
    };

    const inscriptions = await prisma.inscription.findMany({
        where: filtre,
        include: {
            cours: {
                include: {
                    formateur: true,
                    lecons: true,
                },
            },
        },
        skip: (pageValide - 1) * parPage,
        take: parPage,
    });

    const total = await prisma.inscription.count({ where: filtre });

    return {
        inscriptions: inscriptions,
        total: total,
        page: pageValide,
        pages: Math.ceil(total / parPage) || 1,
    };
}


// ------utilisateur est inscrit à ce cours ou pas ----

export async function estInscrit(coursId: string) {

    const utilisateur = await getCurrentUser();
    if (!utilisateur) return null;

    const inscription = await prisma.inscription.findFirst({
        where: {
            utilisateurId: utilisateur.id,
            coursId: coursId,
        },
    });

    return inscription;
}


// ------ Marquer une leçon comme terminée ----------

export async function marquerLeconTerminee(formData: FormData) {

    const leconId = formData.get("leconId") as string;

    const utilisateur = await getCurrentUser();
    if (!utilisateur) throw new Error("Tu dois être connecté.");

    const lecon = await prisma.lecon.findUnique({
        where: { id: leconId },
    });
    if (!lecon) throw new Error("Leçon introuvable.");

    const inscription = await prisma.inscription.findFirst({
        where: {
            utilisateurId: utilisateur.id,
            coursId: lecon.coursId,
        },
    });
    if (!inscription) throw new Error("Tu n'es pas inscrit à ce cours.");

    // en cas ou existant déjà
    const deja = await prisma.leconTerminee.findFirst({
        where: {
            utilisateurId: utilisateur.id,
            leconId: leconId,
        },
    });

    if (!deja) {
        await prisma.leconTerminee.create({
            data: {
                utilisateurId: utilisateur.id,
                leconId: leconId,
            },
        });
    }

    await calculerProgression(utilisateur.id, lecon.coursId);

    revalidatePath(`/cours/${lecon.coursId}`);
    revalidatePath("/profile");
}


// ---------- Calcul de la progression -------

async function calculerProgression(utilisateurId: string, coursId: string) {

    const lecons = await prisma.lecon.findMany({
        where: { coursId: coursId },
    });

    const terminees = await prisma.leconTerminee.findMany({
        where: {
            utilisateurId: utilisateurId,
            lecon: { coursId: coursId },
        },
    });

    let progression = 0;
    if (lecons.length > 0) {
        progression = Math.round((terminees.length / lecons.length) * 100);
    }

    const statut = progression >= 100 ? "TERMINE" : "EN_COURS";

    const inscription = await prisma.inscription.findFirst({
        where: {
            utilisateurId: utilisateurId,
            coursId: coursId,
        },
    });
    if (!inscription) return;

    await prisma.inscription.update({
        where: { id: inscription.id },
        data: {
            progression: progression,
            statut: statut,
        },
    });
}


// ------- Progression détaillée d'un cours ----------

export async function getProgressionCours(coursId: string) {

    const utilisateur = await getCurrentUser();
    if (!utilisateur) return null;

    const inscription = await prisma.inscription.findFirst({
        where: {
            utilisateurId: utilisateur.id,
            coursId: coursId,
        },
        include: {
            cours: {
                include: { lecons: true },
            },
        },
    });
    if (!inscription) return null;

    const terminees = await prisma.leconTerminee.findMany({
        where: {
            utilisateurId: utilisateur.id,
            lecon: { coursId: coursId },
        },
    });

    const lecons = inscription.cours.lecons.map((lecon) => ({
        id: lecon.id,
        titre: lecon.titre,
        terminee: terminees.some((t) => t.leconId === lecon.id),
    }));

    return {
        inscription: inscription,
        lecons: lecons,
    };
}