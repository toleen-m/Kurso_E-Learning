import {Router, type Request, type Response} from "express"
import prisma from "../utils/prisma.js"
import { authentifier } from "../middleswares/auth.middleware.js"
import axios from "axios"
import { opentdb } from "../api/opentdb.js"

const router = Router()

// GET /api/quiz
//lister tous les quizs
router.get("/", async(req:Request, res:Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limite) || 10;

    const [quizs, total] = await Promise.all([
        prisma.quiz.findMany({skip: (page - 1)*limit, take: limit, include: {
            questions: true, lecon: {select: {titre: true}}
        },
        orderBy: {id: "asc"}}),
        prisma.quiz.count()
    ]);
    res.json({page, limit, total, quizs})

    
});

// GET /api/quiz/:id
// afficher un quiz et ses questions 
router.get("/:id", async (req: Request, res: Response) => {
    const quizId = Number(req.params.id);
    try {
        const quiz = await prisma.quiz.findUnique({where: { id: quizId },include: {
            questions: true,
            lecon: { select: { id: true, titre: true }}}
        });

        if (!quiz) {
            return res.status(404).json({ erreur: "Quiz introuvable" });
        }

        res.json(quiz);
    } catch (error) {
        res.status(500).json({ erreur: "Erreur lors de la recuperation du quiz" });
    }
});

// POST /api/quiz/importer
router.post("/importer", authentifier, async(req:Request, res:Response)=> {
    const { titre, leconId } = req.body;

    try {
        const { data } = await opentdb.get("/api.php", {params: {amount: 5,type: "multiple"}});
        // console.log("Reponse d'API :", data);

        if (data.response_code !== 0 || !data.results || data.results.length < 5) {
            return res.status(502).json({ erreur: "Impossible de recupererer 5 questions depuis l'API" });
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

        res.status(201).json({message: `${importe} questions importees avec succes pour le quiz `,quizId: nouveauQuiz.id});

    } catch (e) {
        if (axios.isAxiosError(e)) {
            return res.status(502).json({ erreur: "Erreur API Opentdb" });
        }
    }
});

// PUT /api/quiz/:id
// modifier un quiz
router.put("/:id", authentifier, async (req: Request, res: Response) => {
    const quizId = Number(req.params.id);
    const { titre, score } = req.body;
    try {
        const quizExiste = await prisma.quiz.findUnique({
            where: { id: quizId }
        });

        if (!quizExiste) {
            return res.status(404).json({ erreur: "Quiz introuvable" });
        }

        const quizMisAJour = await prisma.quiz.update({where: { id: quizId },data: {
                ...(titre && { titre }),
                ...(score !== undefined && { score: Number(score) })
            }
        });

        res.json({message: "Quiz mis a jour avec succes",quiz: quizMisAJour});
    } catch (error) {
        res.status(500).json({ erreur: "Erreur lors de la mise a jour du quiz" });
    }
});

// DELETE /api/quiz/:id
// supprimer un quiz et ses questions
router.delete("/:id", authentifier, async (req: Request, res: Response) => {
    const quizId = Number(req.params.id);
    try {
        const quizExiste = await prisma.quiz.findUnique({where: { id: quizId },include: { questions: true }});

        if (!quizExiste) {
            return res.status(404).json({ erreur: "Quiz introuvable" });
        }
        await prisma.question.deleteMany({where: { quizId: quizId }});

        await prisma.quiz.delete({where: {id: quizId }});

        res.json({message: `Quiz "${quizExiste.titre}" et ses questions supprimes avec succes`});

    } catch (error) {
        res.status(500).json({ erreur: "Erreur lors de la suppression du quiz" });
    }
});


//pour pouvoire associer un quiz apres l'avoire cree
// PATCH /quiz/:id/lier-lecon
router.patch("/:id/lier-lecon", authentifier, async (req: Request, res: Response) => {
    const quizId = Number(req.params.id);
    const { leconId } = req.body;

    try {
        const quizUpdate = await prisma.quiz.update({where: { id: quizId }, data: { leconId: Number(leconId) }});

        res.json({message: "Quiz lie a la lecon avec succes ",quiz: quizUpdate});
    } catch (error) {
        res.status(400).json({ erreur: "Impossible de lier le quiz" });
    }
});




export default router;