"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./user.actions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


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


export async function accepterDemande(formData: FormData) { 
    
    const admin = await getCurrentUser(); 
    if (!admin) throw new Error("Vous devez être connecté."); 

    if (admin.role !== "ADMIN") throw new Error("Vous devez être administrateur."); 
    
    const demandeId = formData.get("demandeId") as string; 
    if (!demandeId) throw new Error("Demande introuvable."); 
    
    const demande = await prisma.demandeFormateur.findUnique({ 
        where: { 
            id: demandeId 
        }, 
    }); 
    
    if (!demande) throw new Error("Demande introuvable."); 
    
    await prisma.demandeFormateur.update({ 
        where: { 
            id: demandeId 
        }, 
        data: { 
            statut: "ACCEPTEE" 
        } 
    }); 
    
    await prisma.utilisateur.update({ 
        where: { 
            id: demande.utilisateurId 
        }, 
        data: { 
            role: "FORMATEUR" 
        }, 
    }); 
    
    
    revalidatePath("/profile/gererDemandes"); 
} 


export async function refuserDemande(formData: FormData) { 
    
    const admin = await getCurrentUser(); 
    if (!admin) throw new Error("Vous devez être connecté."); 
    
    if (admin.role !== "ADMIN") throw new Error("Vous devez être administrateur."); 
    
    const demandeId = formData.get("demandeId") as string; 
    if (!demandeId) throw new Error("Demande introuvable."); 
    
    await prisma.demandeFormateur.update({ 
        where: { 
            id: demandeId 
        }, 
        data: { 
            statut: "REFUSEE" 
        }, 
    }); 
    
    revalidatePath("/profile/gererDemandes");
}