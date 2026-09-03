"use server"

import { currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function syncUser() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    throw new Error("Utilisateur non authentifie")
  }

  const existingUser = await prisma.utilisateur.findUnique({
    where: {
      clerkId: clerkUser.id
    }
  })

  if (existingUser) return existingUser

  const email = clerkUser.emailAddresses[0]?.emailAddress

  if (!email) {
    throw new Error("Email introuvable")
  }

  // Vérifie si l'utilisateur existe déjà avec cet email
  const existingEmail = await prisma.utilisateur.findUnique({
    where: {
      email: email
    }
  })

  // Lie l'utilisateur existant à Clerk
  if (existingEmail) {
    return await prisma.utilisateur.update({
      where: {
        id: existingEmail.id
      },
      data: {
        clerkId: clerkUser.id
      }
    })
  }

  // Sinon crée un nouvel utilisateur
  const newUser = await prisma.utilisateur.create({
    data: {
      clerkId: clerkUser.id,
      email: email,
      nom: clerkUser.username || clerkUser.firstName || "Utilisateur"
    }
  })

  return newUser
}

export async function getCurrentUser() {
  const clerkUser = await currentUser()

  if (!clerkUser) return null

  const existingUser = await prisma.utilisateur.findUnique({
    where: {
      clerkId: clerkUser.id
    }
  })

  return existingUser
}

export async function requireRole(role: "ETUDIANT" | "FORMATEUR" | "ADMIN") {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Utilisateur non authentifie")
  }

  if (user.role !== role) {
    throw new Error("Acces interdit")
  }

  return user
}