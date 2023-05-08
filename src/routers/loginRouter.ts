import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { accessTokenSecret } from "../config";
import IAuth from "dealer_common/interfaces/IAuth";
import expressAsyncHandler from "express-async-handler";
import RequestBody from "../interfaces/RequestBody";
import DB from "../DB/DB";
import Logger from "../logger";
import IAuthorization from "dealer_common/interfaces/IAuthorization";
import IUser from "dealer_common/interfaces/IUser";

const loginRouter = express.Router();

loginRouter.post("/", expressAsyncHandler(async (req: RequestBody<IAuthorization>, res: Response<IAuth>, next: NextFunction) => {
    const authID = await DB.Autorizations.SelectIDByAuth(req.body);

    if (authID === null)
    {
        throw new Error(`Неудачная авторизация пользователя ${req.body.login}`);
    }

    let user : IUser | null = await DB.Dealers.SelectByAuthID(authID);

    if (user === null) {
        user = await DB.Admins.SelectByAuthID(authID);

        if (user === null) {
            throw new Error("Не удалось найти пользователя по переданным данным авторизации");
        }
    }

    const accessToken = jwt.sign({ login: req.body.login, type: user.type, id: user.id }, accessTokenSecret);

    Logger.info(`${req.body.login} успешно авторизован`);

    res.json({accessToken, type: user.type, login: user.firstName});
}));

export default loginRouter;