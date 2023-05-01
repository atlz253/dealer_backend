import express, { Request, Response } from "express";
import IBaseContract from "audio_diler_common/interfaces/IBaseContract";
import IContract from "audio_diler_common/interfaces/IContract";
import dealerAuthCheck from "../middleware/dealerAuthCheck";
import jwtCheck from "../middleware/jwtCheck";
import IResponse from "audio_diler_common/interfaces/IResponse";
import expressAsyncHandler from "express-async-handler";
import RequestBody from "../interfaces/RequestBody";
import DB from "../DB/DB";
import Logger from "../logger";
import INewContract from "audio_diler_common/interfaces/INewContract";
import ID from "audio_diler_common/interfaces/ID";

const contractsRouter = express.Router();

contractsRouter.use(jwtCheck);
contractsRouter.use(dealerAuthCheck);

contractsRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IBaseContract[]>) => {
    const contracts = await DB.Contracts.Select();

    res.json(contracts);
}));

contractsRouter.get("/:contractID", expressAsyncHandler(async (req: RequestBody, res: Response<IContract>) => {
    const contractID = Number(req.params.contractID);

    const contract = await DB.Contracts.SelectByID(contractID);

    res.json(contract);
}));

contractsRouter.post("/new", expressAsyncHandler(async (req: RequestBody<INewContract>, res: Response<ID>) => {
    const result = await DB.Contracts.Insert(req.body);

    res.json(result);
}));

export default contractsRouter;