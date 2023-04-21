import express, { NextFunction, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import RequestBody from "../interfaces/RequestBody";
import IBaseUser from "audio_diler_common/interfaces/IBaseUser";
import DB from "../DB/DB";
import IUser from "audio_diler_common/interfaces/IUser";
import ID from "audio_diler_common/interfaces/ID";
import jwtCheck from "../middleware/jwtCheck";
import adminAuthCheck from "../middleware/adminAuthCheck";

const usersRouter = express.Router();

usersRouter.use(jwtCheck);
usersRouter.use(adminAuthCheck);

usersRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IBaseUser[]>, next: NextFunction) => {
    const users = await DB.Users.SelectAll();

    res.send(users);
}));

usersRouter.post("/new", expressAsyncHandler(async (req: RequestBody<IUser>, res: Response<ID>, next: NextFunction) => {
    const id = await DB.Users.Insert(req.body);

    res.send(id);
}));

usersRouter.get("/:userID", expressAsyncHandler(async (req: RequestBody, res: Response<IUser>, next: NextFunction) => {
    const id = Number(req.params.userID);
    
    const user = await DB.Users.SelectByID(id);

    if (user === null) {
        throw Error(`Пользователь с ID ${id} не найден`);
    }

    res.send(user);
}));

usersRouter.put("/:userID", expressAsyncHandler(async (req: RequestBody<IUser>, res: Response, next: NextFunction) => {
    await DB.Users.Update(req.body);

    res.sendStatus(200);
}));

usersRouter.delete("/:userID", expressAsyncHandler(async (req: RequestBody, res: Response, next: NextFunction) => {
    await DB.Users.Delete(Number(req.params.userID));

    res.sendStatus(200);
}));

export default usersRouter;