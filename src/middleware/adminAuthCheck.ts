import { Response, NextFunction } from "express";
import Logger from "../logger";
import RequestBody from "../interfaces/RequestBody";

const adminAuthCheck = (req: RequestBody, res: Response, next: NextFunction) => {
    if (req.jwt === undefined) {
        return res.sendStatus(401);
    }

    if (req.jwt.type !== "admin") {
        Logger.error(`Ошибка авторизации для пользователя ${req.jwt}`);

        return res.sendStatus(401);
    }

    next();
}

export default adminAuthCheck; 