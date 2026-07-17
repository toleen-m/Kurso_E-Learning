import { Router } from "express"
import prisma from "../utils/prisma.js"
import { authentifier } from "../middleswares/auth.middleware.js"

const router = Router()

// S'INSCRIRE (à rev)
router.post("/", authentifier, async (req, res) => {
    try {
        const { coursId } = req.body
        const utilisateurId = req.user.id 


        const inscription = await prisma.inscription.create({
            data: {
                utilisateurId,
                coursId,
                progression: 0
            }
        })

        res.json({
            message: "Inscription réussie",
            inscription
        })

    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(409).json({
                erreur: "Déjà inscrit à ce cours"
            })
        }
        console.log("INSCRIPTION ERROR:", error)
        res.status(500).json({
            erreur: "Erreur serveur"
        })
    }
})

// Inscriptions
router.get("/moi", authentifier, async (req, res) => {
    try {
        const inscriptions = await prisma.inscription.findMany({
            where: { utilisateurId: req.user.id },
            include: { cours: true }
        })
        res.json(inscriptions)
    } catch (error) {
        console.log("LISTE INSCRIPTIONS ERROR:", error)
        res.status(500).json({ erreur: "Erreur serveur" })
    }
})

router.patch("/:id", authentifier, async (req, res) => {
    try {
        const { id } = req.params
        const { progression, statut } = req.body

        const inscription = await prisma.inscription.findUnique({
            where: { id: Number(id) }
        })

        if (!inscription) {
            return res.status(404).json({ erreur: "Inscription introuvable" })
        }

        if (inscription.utilisateurId !== req.user.id) {
            return res.status(403).json({ erreur: "Accès interdit" })
        }

        const misAJour = await prisma.inscription.update({
            where: { id: Number(id) },
            data: { progression, statut }
        })

        res.json({ message: "Inscription mise à jour", inscription: misAJour })

    } catch (error) {
        console.log("UPDATE INSCRIPTION ERROR:", error)
        res.status(500).json({ erreur: "Erreur serveur" })
    }
})



export default router