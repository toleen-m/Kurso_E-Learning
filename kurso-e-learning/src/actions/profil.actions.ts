"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./user.actions";
import { redirect } from "next/navigation";


export async function demanderFormateur(formData: FormData) {

    const utilisateur = await getCurrentUser();
    if (!utilisateur) {
        throw new Error("Vous devez être connecté.");
    }

    if (utilisateur.role !== "ETUDIANT") {
        throw new Error("Vous ne pouvez pas faire cette demande.");
    }

    const motivation = formData.get("motivation") as string;
    const expertise = formData.get("expertise") as string;

    if (!motivation || !expertise) {
        throw new Error("Veuillez remplir tous les champs.");
    }

    await prisma.demandeFormateur.create({
        data: {
            utilisateurId: utilisateur.id,
            motivation: motivation,
            expertise: expertise,
        },
    });

    redirect("/profile");
}

