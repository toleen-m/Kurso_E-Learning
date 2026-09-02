"use server"

import prisma from "@/lib/prisma"

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