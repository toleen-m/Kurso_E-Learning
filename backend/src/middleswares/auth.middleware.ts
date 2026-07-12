import { type Request, type Response, type NextFunction } from "express"
import jwt from "jsonwebtoken"


export function authentifier(
    req: Request,
    res: Response,
    next: NextFunction
) {

    const header = req.headers.authorization
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({
            erreur: "Token manquant"
        })
    }

   const token = header.split(" ")[1]

if (!token) {
    return res.status(401).json({
        erreur: "Token manquant"
    })
}
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        )
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            erreur: "Token invalide"
        })
    }

}