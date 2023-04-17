import IUser from "audio_diler_common/interfaces/IUser";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { accessTokenSecret } from "./config";
import IResponse from "audio_diler_common/interfaces/IResponse";
import IAuth from "audio_diler_common/interfaces/IAuth";

const loginRouter = express.Router();

export const usersMockup: IUser[] = [
    {
        login: "admin",
        password: "admin",
        role: "admin"
    },
    {
        login: "user",
        password: "user",
        role: "diler"
    }
]

loginRouter.post("/", (req: Request, res: Response) => {
    const { login, password } = req.body;

    const user = usersMockup.find(u => login === u.login && password === u.password);

    if (!user) {
        const response: IResponse = { 
            status: 400
        }

        return res.json(response);
    }

    const accessToken = jwt.sign({ login: user.login, role: user.role }, accessTokenSecret);

    const response: IResponse<IAuth> = {
        status: 200,
        data: { accessToken, role: user.role }
    }

    res.json(response);
});

export default loginRouter;