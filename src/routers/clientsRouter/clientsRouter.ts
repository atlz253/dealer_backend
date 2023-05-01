import express, { Response } from "express";
import RequestBody from "../../interfaces/RequestBody";
import expressAsyncHandler from "express-async-handler";
import DB from "../../DB/DB";
import IBaseClient from "audio_diler_common/interfaces/IBaseClient";
import jwtCheck from "../../middleware/jwtCheck";
import dealerAuthCheck from "../../middleware/dealerAuthCheck";
import IClient from "audio_diler_common/interfaces/IClient";
import ID from "audio_diler_common/interfaces/ID";
import billsRouter from "./billsRouter";
import Logger from "../../logger";
import IName from "audio_diler_common/interfaces/IName";

const clientsRouter = express.Router();

clientsRouter.use(jwtCheck);
clientsRouter.use(dealerAuthCheck);

clientsRouter.use("/:clientID/bills", billsRouter)

clientsRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IBaseClient[] | IName[]>) => {
    if (req.query.onlyNames) {
        const names = await DB.Clients.SelectNames();

        res.json(names);
    }
    else {
        const clients = await DB.Clients.SelectAll();

        res.json(clients);
    }
}));

clientsRouter.get("/:clientID", expressAsyncHandler(async (req: RequestBody, res: Response<IClient>) => {
    const clientID = Number(req.params.clientID);

    const client = await DB.Clients.Select(clientID);

    res.json(client);
}));

clientsRouter.post("/new", expressAsyncHandler(async (req: RequestBody<IClient>, res: Response<ID>) => {
    const result = await DB.Clients.Insert(req.body);

    res.json(result);
}));

clientsRouter.put("/:clientID", expressAsyncHandler(async (req: RequestBody<IClient>, res: Response) => {
    await DB.Clients.Update(req.body);

    res.sendStatus(200);
}));

clientsRouter.delete("/:clientID", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const clientID = Number(req.params.clientID);

    await DB.Clients.Delete(clientID);

    res.sendStatus(200);
}));

export default clientsRouter;