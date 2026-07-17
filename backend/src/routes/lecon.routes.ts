import { Router, type Request, type Response } from "express"
import prisma from "../utils/prisma.js"
import { authentifier } from "../middleswares/auth.middleware.js"
import { autoriser } from "../middleswares/role.middleware.js"

const routerLecon = Router()

// GET /lecons
// Récupérer toutes les leçons
routerLecon.get("/", async (_req: Request, res: Response) => {
  try {
    const lecons = await prisma.lecon.findMany({
      include: {
        cours: true
      },
      orderBy: [
        {
          coursId: "asc"
        },
        {
          ordre: "asc"
        }
      ]
    })

    return res.status(200).json(lecons)
  } catch (error) {
    console.error("Erreur GET /lecons :", error)

    return res.status(500).json({
      message: "Erreur lors de la récupération des leçons"
    })
  }
})

// GET /lecons/cours/:coursId
// Récupérer les leçons d'un cours dans l'ordre
// Cette route doit être placée avant GET /lecons/:id
routerLecon.get(
  "/cours/:coursId",
  async (req: Request, res: Response) => {
    try {
      const coursId = Number(req.params.coursId)

      if (Number.isNaN(coursId)) {
        return res.status(400).json({
          message: "L'identifiant du cours est invalide"
        })
      }

      const cours = await prisma.cours.findUnique({
        where: {
          id: coursId
        }
      })

      if (!cours) {
        return res.status(404).json({
          message: "Cours introuvable"
        })
      }

      const lecons = await prisma.lecon.findMany({
        where: {
          coursId
        },
        orderBy: {
          ordre: "asc"
        }
      })

      return res.status(200).json(lecons)
    } catch (error) {
      console.error(
        "Erreur GET /lecons/cours/:coursId :",
        error
      )

      return res.status(500).json({
        message:
          "Erreur lors de la récupération des leçons du cours"
      })
    }
  }
)

// GET /lecons/:id
// Récupérer une leçon précise
routerLecon.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "L'identifiant de la leçon est invalide"
      })
    }

    const lecon = await prisma.lecon.findUnique({
      where: {
        id
      },
      include: {
        cours: true,
        quiz: true
      }
    })

    if (!lecon) {
      return res.status(404).json({
        message: "Leçon introuvable"
      })
    }

    return res.status(200).json(lecon)
  } catch (error) {
    console.error("Erreur GET /lecons/:id :", error)

    return res.status(500).json({
      message: "Erreur lors de la récupération de la leçon"
    })
  }
})

// POST /lecons
// Créer une leçon
// Réservé au rôle FORMATEUR
routerLecon.post(
  "/",
  authentifier,
  autoriser("FORMATEUR"),
  async (req: Request, res: Response) => {
    try {
      const { titre, contenu, ordre, coursId } = req.body

      if (
        !titre ||
        !contenu ||
        ordre === undefined ||
        coursId === undefined
      ) {
        return res.status(400).json({
          message:
            "Le titre, le contenu, l'ordre et le coursId sont obligatoires"
        })
      }

      const coursIdNombre = Number(coursId)
      const ordreNombre = Number(ordre)

      if (
        Number.isNaN(coursIdNombre) ||
        Number.isNaN(ordreNombre)
      ) {
        return res.status(400).json({
          message: "Le coursId et l'ordre doivent être des nombres"
        })
      }

      const cours = await prisma.cours.findUnique({
        where: {
          id: coursIdNombre
        }
      })

      if (!cours) {
        return res.status(404).json({
          message: "Cours introuvable"
        })
      }

      const leconExistante = await prisma.lecon.findFirst({
        where: {
          coursId: coursIdNombre,
          titre
        }
      })

      if (leconExistante) {
        return res.status(409).json({
          message:
            "Une leçon avec ce titre existe déjà dans ce cours"
        })
      }

      const nouvelleLecon = await prisma.lecon.create({
        data: {
          titre,
          contenu,
          ordre: ordreNombre,
          coursId: coursIdNombre
        }
      })

      return res.status(201).json(nouvelleLecon)
    } catch (error) {
      console.error("Erreur POST /lecons :", error)

      return res.status(500).json({
        message: "Erreur lors de la création de la leçon"
      })
    }
  }
)

// PUT /lecons/:id
// Modifier une leçon
// Réservé au rôle FORMATEUR
routerLecon.put(
  "/:id",
  authentifier,
  autoriser("FORMATEUR"),
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const { titre, contenu, ordre } = req.body

      if (Number.isNaN(id)) {
        return res.status(400).json({
          message: "L'identifiant de la leçon est invalide"
        })
      }

      const leconExistante = await prisma.lecon.findUnique({
        where: {
          id
        }
      })

      if (!leconExistante) {
        return res.status(404).json({
          message: "Leçon introuvable"
        })
      }

      const donneesModification: {
        titre?: string
        contenu?: string
        ordre?: number
      } = {}

      if (titre !== undefined) {
        donneesModification.titre = titre
      }

      if (contenu !== undefined) {
        donneesModification.contenu = contenu
      }

      if (ordre !== undefined) {
        const ordreNombre = Number(ordre)

        if (Number.isNaN(ordreNombre)) {
          return res.status(400).json({
            message: "L'ordre doit être un nombre"
          })
        }

        donneesModification.ordre = ordreNombre
      }

      if (Object.keys(donneesModification).length === 0) {
        return res.status(400).json({
          message:
            "Aucune donnée valide n'a été fournie pour la modification"
        })
      }

      const leconModifiee = await prisma.lecon.update({
        where: {
          id
        },
        data: donneesModification
      })

      return res.status(200).json(leconModifiee)
    } catch (error) {
      console.error("Erreur PUT /lecons/:id :", error)

      return res.status(500).json({
        message: "Erreur lors de la modification de la leçon"
      })
    }
  }
)

// DELETE /lecons/:id
// Supprimer une leçon
// Réservé au rôle FORMATEUR
routerLecon.delete(
  "/:id",
  authentifier,
  autoriser("FORMATEUR"),
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)

      if (Number.isNaN(id)) {
        return res.status(400).json({
          message: "L'identifiant de la leçon est invalide"
        })
      }

      const leconExistante = await prisma.lecon.findUnique({
        where: {
          id
        }
      })

      if (!leconExistante) {
        return res.status(404).json({
          message: "Leçon introuvable"
        })
      }

      await prisma.lecon.delete({
        where: {
          id
        }
      })

      return res.status(200).json({
        message: "Leçon supprimée avec succès"
      })
    } catch (error) {
      console.error("Erreur DELETE /lecons/:id :", error)

      return res.status(500).json({
        message: "Erreur lors de la suppression de la leçon"
      })
    }
  }
)

export default routerLecon