import { Router, type Request, type Response } from "express"
import prisma from "../utils/prisma.js"
import { authentifier } from "../middleswares/auth.middleware.js"
import { autoriser } from "../middleswares/role.middleware.js"

const routerCours = Router()

// GET /cours
// Récupérer tous les cours avec leurs leçons dans l'ordre
routerCours.get("/", async (req: Request, res: Response) => {
  try {
    const cours = await prisma.cours.findMany({
      include: {
        lecons: {
          orderBy: {
            ordre: "asc"
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return res.status(200).json(cours)
  } catch (error) {
    console.error("Erreur GET /cours :", error)

    return res.status(500).json({
      message: "Erreur lors de la récupération des cours"
    })
  }
})

// GET /cours/:id
// Récupérer un cours précis avec ses leçons
routerCours.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "L'identifiant du cours est invalide"
      })
    }

    const cours = await prisma.cours.findUnique({
      where: {
        id
      },
      include: {
        lecons: {
          orderBy: {
            ordre: "asc"
          }
        }
      }
    })

    if (!cours) {
      return res.status(404).json({
        message: "Cours introuvable"
      })
    }

    return res.status(200).json(cours)
  } catch (error) {
    console.error("Erreur GET /cours/:id :", error)

    return res.status(500).json({
      message: "Erreur lors de la récupération du cours"
    })
  }
})

// POST /cours
// Créer un cours
// Réservé au rôle FORMATEUR
routerCours.post(
  "/",
  authentifier,
  autoriser("FORMATEUR"),
  async (req: Request, res: Response) => {
    try {
      const { titre, description, niveau } = req.body

      if (!titre || !description) {
        return res.status(400).json({
          message: "Le titre et la description sont obligatoires"
        })
      }

      const niveauxAutorises = [
        "DEBUTANT",
        "INTERMEDIAIRE",
        "AVANCE"
      ]

      if (niveau && !niveauxAutorises.includes(niveau)) {
        return res.status(400).json({
          message:
            "Le niveau doit être DEBUTANT, INTERMEDIAIRE ou AVANCE"
        })
      }

      const coursExistant = await prisma.cours.findUnique({
        where: {
          titre
        }
      })

      if (coursExistant) {
        return res.status(409).json({
          message: "Un cours avec ce titre existe déjà"
        })
      }

      const nouveauCours = await prisma.cours.create({
        data: {
          titre,
          description,
          niveau: niveau || "DEBUTANT"
        }
      })

      return res.status(201).json(nouveauCours)
    } catch (error) {
      console.error("Erreur POST /cours :", error)

      return res.status(500).json({
        message: "Erreur lors de la création du cours"
      })
    }
  }
)

// PUT /cours/:id
// Modifier un cours
// Réservé au rôle FORMATEUR
routerCours.put(
  "/:id",
  authentifier,
  autoriser("FORMATEUR"),
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      const { titre, description, niveau } = req.body

      if (Number.isNaN(id)) {
        return res.status(400).json({
          message: "L'identifiant du cours est invalide"
        })
      }

      const coursExistant = await prisma.cours.findUnique({
        where: {
          id
        }
      })

      if (!coursExistant) {
        return res.status(404).json({
          message: "Cours introuvable"
        })
      }

      const niveauxAutorises = [
        "DEBUTANT",
        "INTERMEDIAIRE",
        "AVANCE"
      ]

      if (niveau && !niveauxAutorises.includes(niveau)) {
        return res.status(400).json({
          message:
            "Le niveau doit être DEBUTANT, INTERMEDIAIRE ou AVANCE"
        })
      }

      const coursModifie = await prisma.cours.update({
        where: {
          id
        },
        data: {
          titre,
          description,
          niveau
        }
      })

      return res.status(200).json(coursModifie)
    } catch (error) {
      console.error("Erreur PUT /cours/:id :", error)

      return res.status(500).json({
        message: "Erreur lors de la modification du cours"
      })
    }
  }
)

// DELETE /cours/:id
// Supprimer un cours
// Réservé au rôle FORMATEUR
routerCours.delete(
  "/:id",
  authentifier,
  autoriser("FORMATEUR"),
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)

      if (Number.isNaN(id)) {
        return res.status(400).json({
          message: "L'identifiant du cours est invalide"
        })
      }

      const coursExistant = await prisma.cours.findUnique({
        where: {
          id
        }
      })

      if (!coursExistant) {
        return res.status(404).json({
          message: "Cours introuvable"
        })
      }

      await prisma.cours.delete({
        where: {
          id
        }
      })

      return res.status(200).json({
        message: "Cours supprimé avec succès"
      })
    } catch (error) {
      console.error("Erreur DELETE /cours/:id :", error)

      return res.status(500).json({
        message: "Erreur lors de la suppression du cours"
      })
    }
  }
)

export default routerCours