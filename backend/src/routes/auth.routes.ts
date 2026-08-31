import { Router } from "express"
import prisma from "../utils/prisma.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { authentifier } from "../middleswares/auth.middleware.js"

const router = Router()


router.post("/register", async (req, res) => {

    try {
        const { nom, email, password } = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        const utilisateur = await prisma.utilisateur.create({
            data: {
                nom,
                email,
                password: passwordHash
            }
        })

        res.json({
            message: "Utilisateur créé",
            utilisateur: {
                id: utilisateur.id,
                nom: utilisateur.nom,
                email: utilisateur.email,

                role: utilisateur.role,
                createdAt: utilisateur.createdAt
            }
        })

    } catch (error) {
        console.log("REGISTER ERROR:", error)
        res.status(500).json({
            erreur: "Erreur serveur"
        })
    }
})


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const utilisateur = await prisma.utilisateur.findUnique({
            where: {
                email
            }
        })
        if (!utilisateur) {
            return res.status(401).json({
                erreur: "Email ou mot de passe incorrect"
            })
        }

        const passwordCorrect = await bcrypt.compare(
            password,
            utilisateur.password
        )
        if (!passwordCorrect) {
            return res.status(401).json({
                erreur: "Email ou mot de passe incorrect."
            })
        }


        const token = jwt.sign(
            {
                id: utilisateur.id,
                role: utilisateur.role
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1h"
            }
        )
        res.json({
            message: "Connexion réussie",
            token
        })


    } catch (error) {
        console.log("LOGIN ERROR:", error)
        res.status(500).json({
            erreur: "Erreur serveur"
        })
    }
})

router.get("/me", authentifier, async (req, res) => {
    try {
        const utilisateur = await prisma.utilisateur.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                nom: true,
                email: true,
                role: true,
                createdAt: true
            }
        })

        if (!utilisateur) {
            return res.status(404).json({
                erreur: "Utilisateur introuvable"
            })
        }

        return res.json(utilisateur)

    } catch (error) {
        console.log("ME ERROR:", error)

        return res.status(500).json({
            erreur: "Erreur serveur"
        })
    }
})

export default router