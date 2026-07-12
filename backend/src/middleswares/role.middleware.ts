import { type Request, type Response, type NextFunction } from "express"
export function autoriser(...roles: string[]) {


    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                erreur: "Utilisateur non connecté"
            })
        }


        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                erreur: "Accès interdit"
            })
        }
        next()
    }
}