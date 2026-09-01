"use server"

import prisma from "@/lib/prisma"

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