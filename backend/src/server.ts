import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import prisma from "./utils/prisma.js"
import routerAuth from "./routes/auth.routes.js"
import { authentifier } from "./middleswares/auth.middleware.js"
import { autoriser } from "./middleswares/role.middleware.js"
dotenv.config()

const app = express()
app.use(express.json())
app.use("/auth", routerAuth)

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Kurso - Platform E-learning" })
})

app.get("/test-db", async (req: Request, res: Response) => {
  const utilisateurs = await prisma.utilisateur.findMany()

  res.json(utilisateurs)
})

app.get(
    "/admin",
    authentifier,
    autoriser("ADMIN"),
    (req, res) => {

        res.json({
            message: "Bienvenue admin"
        })

    }
)
//localhost:3000/auth/...



const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server sur http://localhost:${PORT}`))