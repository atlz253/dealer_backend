import { Request, Response, NextFunction } from "express";
import IResponse from "audio_diler_common/interfaces/IResponse";
import jwt from "jsonwebtoken";
import { accessTokenSecret } from "./config";

export interface AuthRequest extends Request {
    user?: any
}

const jwtCheck = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        const status: IResponse = {
            status: 401
        }

        return res.json(status);
    }

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            const status: IResponse = {
                status: 401
            }
    
            return res.json(status);
        }

        req.user = user;

        next();
    });
}

export default jwtCheck;