"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/actions/user.actions"

export async function getLeconById(id: string) {
  const lecon = await prisma.lecon.findUnique({
    where: {
      id,
    },
    include: {
      cours: true,
      quiz: true,
    },
  })

  return lecon
}

export async function createLecon(formData: FormData) {
  const utilisateur = await getCurrentUser()

  if (!utilisateur) {
    throw new Error("Utilisateur non authentifié")
  }

  if (utilisateur.role == "ETUDIANT") {
    throw new Error("Seul un formateur peut créer une leçon")
  }

  const titre = formData.get("titre") as string
  const contenu = formData.get("contenu") as string
  const ordre = Number(formData.get("ordre"))
  const coursId = formData.get("coursId") as string

  if (!titre || !contenu || !coursId || Number.isNaN(ordre)) {
    throw new Error("Tous les champs sont obligatoires")
  }

  const cours = await prisma.cours.findUnique({
    where: {
      id: coursId,
    },
  })

  if (!cours) {
    throw new Error("Cours introuvable")
  }

  if (cours.formateurId !== utilisateur.id) {
    throw new Error(
      "Vous ne pouvez ajouter une leçon qu'à vos propres cours"
    )
  }

  await prisma.lecon.create({
    data: {
      titre,
      contenu,
      ordre,
      coursId,
    },
  })

  revalidatePath(`/cours/${coursId}`)
}

export async function updateLecon(formData: FormData) {
  const utilisateur = await getCurrentUser()

  if (!utilisateur) {
    throw new Error("Utilisateur non authentifié")
  }

  if (utilisateur.role == "ETUDIANT") {
    throw new Error("Seul un formateur peut modifier une leçon")
  }

  const id = formData.get("id") as string
  const titre = formData.get("titre") as string
  const contenu = formData.get("contenu") as string
  const ordre = Number(formData.get("ordre"))

  if (!id || !titre || !contenu || Number.isNaN(ordre)) {
    throw new Error("Tous les champs sont obligatoires")
  }

  const lecon = await prisma.lecon.findUnique({
    where: {
      id,
    },
    include: {
      cours: true,
    },
  })

  if (!lecon) {
    throw new Error("Leçon introuvable")
  }

  if (lecon.cours.formateurId !== utilisateur.id) {
    throw new Error(
      "Vous ne pouvez modifier que les leçons de vos propres cours"
    )
  }

  await prisma.lecon.update({
    where: {
      id,
    },
    data: {
      titre,
      contenu,
      ordre,
    },
  })

  revalidatePath(`/cours/${lecon.coursId}`)
  revalidatePath(`/cours/${lecon.coursId}/lecons/${id}`)
}

export async function deleteLecon(formData: FormData) {
  const utilisateur = await getCurrentUser()

  if (!utilisateur) {
    throw new Error("Utilisateur non authentifié")
  }

  if (utilisateur.role == "ETUDIANT") {
    throw new Error("Seul un formateur peut supprimer une leçon")
  }

  const id = formData.get("id") as string

  if (!id) {
    throw new Error("Identifiant de la leçon manquant")
  }

  const lecon = await prisma.lecon.findUnique({
    where: {
      id,
    },
    include: {
      cours: true,
    },
  })

  if (!lecon) {
    throw new Error("Leçon introuvable")
  }

  if (lecon.cours.formateurId !== utilisateur.id) {
    throw new Error(
      "Vous ne pouvez supprimer que les leçons de vos propres cours"
    )
  }

  const coursId = lecon.coursId

  await prisma.lecon.delete({
    where: {
      id,
    },
  })

  revalidatePath(`/cours/${coursId}`)
  redirect(`/cours/${coursId}`)
}