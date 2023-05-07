import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { accessTokenSecret } from "../config";
import Logger from "../logger";
import RequestBody from "../interfaces/RequestBody";
import IJWT from "../interfaces/IJWT";

const jwtCheck = (req: RequestBody, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        Logger.error(`${req.ip} отправлен пустой токен авторизации`)

        return res.sendStatus(401);
    }

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            Logger.error(`${req.ip} ошибка проверки токена`)

            return res.sendStatus(401);
        }
        
        const token = user as IJWT;

        req.jwt = token;

        Logger.debug(`${req.ip} успешная проверка авторизации ${req.jwt.login}`);

        next();
    });
}

export default jwtCheck;