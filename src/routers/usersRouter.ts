import express, { NextFunction, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import RequestBody from "../interfaces/RequestBody";
import DB from "../DB/DB";
import ID from "dealer_common/interfaces/ID";
import jwtCheck from "../middleware/jwtCheck";
import adminAuthCheck from "../middleware/adminAuthCheck";
import Logger from "../logger";
import IDealer from "dealer_common/interfaces/IDealer";
import IUser from "dealer_common/interfaces/IUser";

const usersRouter = express.Router();

usersRouter.use(jwtCheck);
usersRouter.use(adminAuthCheck);

usersRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IUser[]>, next: NextFunction) => {
    const admins = await DB.Admins.Select();
    const dealers = await DB.Dealers.Select();

    const users = [...admins, ...dealers];

    res.send(users);
}));

usersRouter.post("/new", expressAsyncHandler(async (req: RequestBody<IUser>, res: Response<ID>, next: NextFunction) => {
    if (req.body.login === undefined || req.body.password === undefined) {
        throw new Error("Не были переданы данные для авторизации");
    }

    let id: number;

    switch (req.body.type) {
        case "admin":
            id = await DB.Admins.Insert(req.body);

            break;
        case "dealer":
            id = await DB.Dealers.Insert(req.body as IDealer);

            break;
        default:
            throw new Error("Не удалось определить тип добавляемого пользователя");
    }

    res.send({ id });
}));

usersRouter.get("/:userID", expressAsyncHandler(async (req: RequestBody, res: Response<IUser>, next: NextFunction) => {
    const id = Number(req.params.userID);

    let user: IUser | null = await DB.Dealers.SelectByAuthID(id);

    if (user === null) {
        user = await DB.Admins.SelectByAuthID(id);

        if (user === null) {
            throw new Error(`Пользователь с ID ${id} не найден`);
        }
    }

    res.send({ ...user, id }); // Меняем id на authorization_id
}));

usersRouter.put("/:userID", expressAsyncHandler(async (req: RequestBody<IUser>, res: Response, next: NextFunction) => {
    switch (req.body.type) {
        case "admin":
            await DB.Admins.Update(req.body);

            break;
        case "dealer":
            await DB.Dealers.Update(req.body as IDealer);

            break;
        default:
            throw new Error("Не удалось определить тип изменяемого пользователя");
    }

    res.sendStatus(200);
}));

usersRouter.delete("/:userID", expressAsyncHandler(async (req: RequestBody, res: Response, next: NextFunction) => {
    const id = Number(req.params.userID);

    if (id === 1) {
        throw new Error("Первого администратора удалять запрещено");
    }

    const dealerID = await DB.Dealers.SelectIDByAuthID(id);

    if (dealerID !== null) {
        await DB.Dealers.Delete(id);
    }
    else {
        await DB.Admins.Delete(id);
    }

    await DB.Autorizations.Delete(id);

    Logger.info(`${req.jwt?.login} удалил пользователя с ID ${req.params.userID}`);

    res.sendStatus(200);
}));

export default usersRouter;