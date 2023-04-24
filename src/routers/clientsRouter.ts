import express, { Response } from "express";
import RequestBody from "../interfaces/RequestBody";
import expressAsyncHandler from "express-async-handler";
import DB from "../DB/DB";
import IBaseClient from "audio_diler_common/interfaces/IBaseClient";
import jwtCheck from "../middleware/jwtCheck";
import dealerAuthCheck from "../middleware/dealerAuthCheck";

const clientsRouter = express.Router();

clientsRouter.use(jwtCheck);
clientsRouter.use(dealerAuthCheck);

clientsRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IBaseClient[]>) => {
    const clients = await DB.Clients.SelectAll();

    res.json(clients);
}));

export default clientsRouter;