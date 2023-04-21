import { Request, Response, NextFunction } from "express";
import IResponse from "audio_diler_common/interfaces/IResponse";
import jwt from "jsonwebtoken";
import { accessTokenSecret } from "../config";

export interface AuthRequest extends Request {
    user?: any
}

const jwtCheck = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(401);
        }

        req.user = user;

        next();
    });
}

export default jwtCheck;