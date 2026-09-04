"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/actions/user.actions"

export async function getCours() {
  const cours = await prisma.cours.findMany({
    include: {
      formateur: true,
      lecons: {
        orderBy: {
          ordre: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return cours
}

export async function getCoursById(id: string) {
  const cours = await prisma.cours.findUnique({
    where: {
      id,
    },
    include: {
      formateur: true,
      lecons: {
        orderBy: {
          ordre: "asc",
        },
      },
    },
  })

  return cours
}

export async function createCours(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Utilisateur non authentifié")
  }

  if (user.role !== "FORMATEUR") {
    throw new Error("Seul un formateur peut créer un cours")
  }

  const titre = formData.get("titre") as string
  const description = formData.get("description") as string
  const niveau = formData.get("niveau") as
    | "DEBUTANT"
    | "INTERMEDIAIRE"
    | "AVANCE"

  if (!titre || !description || !niveau) {
    throw new Error("Tous les champs sont obligatoires")
  }

  const coursExistant = await prisma.cours.findFirst({
    where: {
      titre,
      formateurId: user.id,
    },
  })

  if (coursExistant) {
    throw new Error("Vous avez déjà un cours avec ce titre")
  }

  await prisma.cours.create({
    data: {
      titre,
      description,
      niveau,
      formateurId: user.id,
    },
  })

  revalidatePath("/cours")
}

export async function updateCours(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Utilisateur non authentifié")
  }

  if (user.role !== "FORMATEUR") {
    throw new Error("Seul un formateur peut modifier un cours")
  }

  const id = formData.get("id") as string
  const titre = formData.get("titre") as string
  const description = formData.get("description") as string
  const niveau = formData.get("niveau") as
    | "DEBUTANT"
    | "INTERMEDIAIRE"
    | "AVANCE"

  if (!id || !titre || !description || !niveau) {
    throw new Error("Tous les champs sont obligatoires")
  }

  const cours = await prisma.cours.findUnique({
    where: {
      id,
    },
  })

  if (!cours) {
    throw new Error("Cours introuvable")
  }

  if (cours.formateurId !== user.id) {
    throw new Error("Vous ne pouvez modifier que vos propres cours")
  }

  await prisma.cours.update({
    where: {
      id,
    },
    data: {
      titre,
      description,
      niveau,
    },
  })

  revalidatePath("/cours")
  revalidatePath(`/cours/${id}`)
}

export async function deleteCours(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Utilisateur non authentifié")
  }

  if (user.role !== "FORMATEUR") {
    throw new Error("Seul un formateur peut supprimer un cours")
  }

  const id = formData.get("id") as string

  if (!id) {
    throw new Error("Identifiant du cours manquant")
  }

  const cours = await prisma.cours.findUnique({
    where: {
      id,
    },
  })

  if (!cours) {
    throw new Error("Cours introuvable")
  }

  if (cours.formateurId !== user.id) {
    throw new Error("Vous ne pouvez supprimer que vos propres cours")
  }

  await prisma.cours.delete({
    where: {
      id,
    },
  })

  revalidatePath("/cours")
  redirect("/cours")
}