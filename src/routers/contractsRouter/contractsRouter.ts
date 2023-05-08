import express, { Request, Response } from "express";
import IBaseContract from "dealer_common/interfaces/IBaseContract";
import IContract from "dealer_common/interfaces/IContract";
import dealerAuthCheck from "../../middleware/dealerAuthCheck";
import jwtCheck from "../../middleware/jwtCheck";
import expressAsyncHandler from "express-async-handler";
import RequestBody from "../../interfaces/RequestBody";
import DB from "../../DB/DB";
import Logger from "../../logger";
import INewContract from "dealer_common/interfaces/INewContract";
import ID from "dealer_common/interfaces/ID";
import ICheques from "../../interfaces/ICheques";
import { DateTime } from "luxon";
import chequesRouter from "./chequesRouter";
import ICount from "dealer_common/interfaces/ICount";

const contractsRouter = express.Router();

contractsRouter.use(jwtCheck);
contractsRouter.use(dealerAuthCheck);

contractsRouter.use("/:contractID/cheques", chequesRouter);

contractsRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IBaseContract[]>) => {
    const contracts = await DB.Contracts.Select();

    res.json(contracts);
}));

contractsRouter.get("/count", expressAsyncHandler(async (req: RequestBody, res: Response<ICount>) => {
    const contractStatus = req.query.contractStatus;

    if (typeof contractStatus !== "string" && contractStatus !== undefined) {
        throw new Error("Был передан некорректный параметр contractStatus");
    }

    const count = await DB.Contracts.SelectCount(contractStatus);

    res.json(count);
}));

contractsRouter.get("/:contractID", expressAsyncHandler(async (req: RequestBody, res: Response<IContract>) => {
    const contractID = Number(req.params.contractID);

    const contract = await DB.Contracts.SelectByID(contractID);

    res.json(contract);
}));

contractsRouter.post("/new", expressAsyncHandler(async (req: RequestBody<INewContract>, res: Response<ID>) => {
    const result = await DB.Contracts.Insert(req.body);

    const cheques: ICheques = {

    };

    req.body.products.forEach(product => {
        const key = product.deliveryDays;

        if (cheques[key] === undefined) {
            cheques[key] = [product];
        }
        else {
            cheques[key].push(product);
        }
    });

    for (let key in cheques) {
        const deliveryDate = DateTime.now().plus({ days: Number(key) }).toISO();

        if (deliveryDate === null) {
            Logger.error("Не получилось определить дату доставки");

            continue;
        }

        const chequeID = await DB.Cheques.Insert(result.id, deliveryDate)

        await DB.Cheques.Products.Insert(chequeID.id, cheques[key]);
    }

    res.json(result);
}));

export default contractsRouter;