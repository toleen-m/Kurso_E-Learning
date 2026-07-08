import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Kurso - Platform E-learning" })
})

//localhost:3000/auth/...


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server sur http://localhost:${PORT}`))