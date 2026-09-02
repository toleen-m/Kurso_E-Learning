"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

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