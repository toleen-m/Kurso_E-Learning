import {Router, type Request, type Response} from "express"
import prisma from "../utils/prisma.js"
import { authentifier } from "../middleswares/auth.middleware.js"
import axios from "axios"
import { opentdb } from "../api/opentdb.js"

const router = Router()

// GET /quiz
router.get("/", async(req:Request, res:Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limite) || 10;

    const [quizs, total] = await Promise.all([
        prisma.quiz.findMany({skip: (page - 1)*limit, take: limit, include: {
            questions: true, lecon: {select: {titre: true}}
        },
        orderBy: {id: "desc"}}),
        prisma.quiz.count()
    ]);
    res.json({page, limit, total, quizs})

    
})

// POST /quiz/importer
router.post("/importer", authentifier, async(req:Request, res:Response)=> {
    const { titre, leconId } = req.body;

    try {
        const { data } = await opentdb.get("/api.php", {params: {amount: 5,type: "multiple"}});
        console.log("Reponse d'API :", data);

        if (data.response_code !== 0 || !data.results || data.results.length < 5) {
            return res.status(502).json({ erreur: "Impossible de recupererer 5 questions depuis l'API." });
        }

        let importe = 0;

        const nouveauQuiz = await prisma.quiz.create({
            data: {
                titre: titre || "Quiz genere automatiquement",
                score: 5,
                ...(leconId && { leconId: Number(leconId) })
            }
        });

        for (const q of data.results) {
            await prisma.question.create({
                data: {
                    enonce: q.question,
                    bonneReponse: q.correct_answer,
                    mauvaisesReponses: q.incorrect_answers, 
                    quizId: nouveauQuiz.id                  
                }
            });
            importe++;
        }

        res.status(201).json({message: `${importe} questions importees avec succes pour le quiz !`,quizId: nouveauQuiz.id});

    } catch (e) {
        if (axios.isAxiosError(e)) {
            return res.status(502).json({ erreur: "Serveur down de opentdb !" });
        }
    }
});


//pour pouvoire associer un quiz apres l'avoire cree
// PATCH /quiz/:id/lier-lecon
router.patch("/:id/lier-lecon", authentifier, async (req: Request, res: Response) => {
    const quizId = Number(req.params.id);
    const { leconId } = req.body;

    try {
        const quizUpdate = await prisma.quiz.update({
            where: { id: quizId },
            data: { leconId: Number(leconId) }
        });

        res.json({message: "Quiz lie a la lecon avec succes !",quiz: quizUpdate});
    } catch (error) {
        res.status(400).json({ erreur: "Impossible de lier le quiz" });
    }
});




export default router;