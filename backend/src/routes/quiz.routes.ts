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
    const { titre, leconId } = req.body; // On récupère le titre et l'ID de la leçon (optionnel)

    try {
        const { data } = await opentdb.get("/api.php", {params: {amount: 5,type: "multiple"}});
        console.log("🔍 RÉPONSE BRUTE DE L'API :", data);

        // Vérification que l'API a bien renvoyé des données
        if (data.response_code !== 0 || !data.results || data.results.length < 5) {
            return res.status(502).json({ erreur: "Impossible de récupérer 5 questions depuis l'API." });
        }

        let importe = 0;

        // 2. Créer le Quiz en base de données d'abord pour avoir un ID
        const nouveauQuiz = await prisma.quiz.create({
            data: {
                titre: titre || "Quiz généré automatiquement",
                score: 5, // 5 questions = 5 points maximum
                ...(leconId && { leconId: Number(leconId) }) // Lie à la leçon si fourni
            }
        });

        // 3. Transformer et stocker les 5 questions une par une
        for (const q of data.results) {
            await prisma.question.create({
                data: {
                    enonce: q.question,
                    bonneReponse: q.correct_answer,
                    mauvaisesReponses: q.incorrect_answers, // L'API renvoie déjà un tableau de 3 mauvaises réponses
                    quizId: nouveauQuiz.id                  // On lie la question au quiz qu'on vient de créer
                }
            });
            importe++;
        }

        // 4. Réponse de succès
        res.status(201).json({message: `${importe} questions importées avec succès pour le quiz !`,quizId: nouveauQuiz.id});

    } catch (e) {
        if (axios.isAxiosError(e)) {
            return res.status(502).json({ erreur: "Serveur down de opentdb !" });
        }
    }
});

export default router;