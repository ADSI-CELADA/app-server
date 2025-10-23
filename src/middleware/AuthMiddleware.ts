import { Response, NextFunction } from "express";
import { IJwtPayload, IAuthRequest } from "../interface/IAuth";
import jwt from "jsonwebtoken";
import { Environment } from "../config/Config";


export class AuthMiddleware {

    private env: Environment;

    constructor() {
        this.env = Environment.getInstance();
    }

    public verifyToken(req: IAuthRequest, res: Response, next: NextFunction): void {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({ data: "TOKEN_NOT_PROVIDED" });
                return;
            }

            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(token, this.env.get("JWT_KEY"));

            if (!decoded || typeof decoded !== "object" || !decoded.email) {
                res.status(401).json({ data: "INVALID_TOKEN_PAYLOAD" });
                return;
            }

            req.user = decoded as IJwtPayload;

            next();

        } catch (error) {
            res.status(401).json({ data: "TOKEN_INVALID_OR_EXPIRED" });
        }
    }



} 