import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { accessTokenSecret } from "../config";
import IAuth from "audio_diler_common/interfaces/IAuth";
import expressAsyncHandler from "express-async-handler";
import RequestBody from "../interfaces/RequestBody";
import ILoginData from "audio_diler_common/interfaces/ILoginData";
import DB from "../DB/DB";
import Logger from "../logger";

const loginRouter = express.Router();

loginRouter.post("/", expressAsyncHandler(async (req: RequestBody<ILoginData>, res: Response<IAuth>, next: NextFunction) => {
    const authInfo = await DB.Users.SelectByLoginData(req.body);

    if (authInfo === null)
    {
        throw Error(`Неудачная авторизация пользователя ${req.body.login}`);
    }

    const accessToken = jwt.sign({ login: authInfo.login, type: authInfo.type }, accessTokenSecret);

    Logger.info(`${authInfo.login} успешно авторизован`);

    res.json({...authInfo, accessToken});
}));

export default loginRouter;