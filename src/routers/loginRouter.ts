import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { accessTokenSecret } from "../config";
import IAuth from "audio_diler_common/interfaces/IAuth";
import expressAsyncHandler from "express-async-handler";
import RequestBody from "../interfaces/RequestBody";
import DB from "../DB/DB";
import Logger from "../logger";
import IAuthorization from "audio_diler_common/interfaces/IAuthorization";

const loginRouter = express.Router();

loginRouter.post("/", expressAsyncHandler(async (req: RequestBody<IAuthorization>, res: Response<IAuth>, next: NextFunction) => {
    const authID = await DB.Autorizations.SelectIDByAuth(req.body);

    if (authID === null)
    {
        throw new Error(`Неудачная авторизация пользователя ${req.body.login}`);
    }

    let admin = await DB.Admins.SelectByAuthID(authID);

    if (admin === null) {
        throw new Error("aaaaaaaaaaaaaaaa");
    }

    let userType = "admin";

    const accessToken = jwt.sign({ login: req.body.login, type: userType }, accessTokenSecret);

    Logger.info(`${req.body.login} успешно авторизован`);

    res.json({accessToken, type: userType, login: admin?.firstName});
}));

export default loginRouter;