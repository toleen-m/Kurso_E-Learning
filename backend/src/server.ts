import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import prisma from "./utils/prisma.js"
import routerAuth from "./routes/auth.routes.js"
import routerCours from "./routes/cours.routes.js"
import routerLecon from "./routes/lecon.routes.js"
import { authentifier } from "./middleswares/auth.middleware.js"
import { autoriser } from "./middleswares/role.middleware.js"

dotenv.config()

const app = express()

app.use(express.json())

// Routes principales
app.use("/auth", routerAuth)
app.use("/cours", routerCours)
app.use("/lecons", routerLecon)

// Route d'accueil
app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Kurso - Platform E-learning"
  })
})

// Route pour tester la connexion à la base de données
app.get("/test-db", async (req: Request, res: Response) => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany()

    return res.status(200).json(utilisateurs)
  } catch (error) {
    console.error("Erreur test base de données :", error)

    return res.status(500).json({
      message: "Erreur de connexion à la base de données"
    })
  }
})

// Route de test réservée à l'administrateur
app.get(
  "/admin",
  authentifier,
  autoriser("ADMIN"),
  (req: Request, res: Response) => {
    return res.json({
      message: "Bienvenue admin"
    })
  }
)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server sur http://localhost:${PORT}`)
})