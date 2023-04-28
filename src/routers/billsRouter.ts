import express, { Response } from "express";
import expressAsyncHandler from "express-async-handler";
import RequestBody from "../interfaces/RequestBody";
import IBaseBill from "audio_diler_common/interfaces/IBaseBill";
import DB from "../DB/DB";
import jwtCheck from "../middleware/jwtCheck";
import dealerAuthCheck from "../middleware/dealerAuthCheck";
import IBill from "audio_diler_common/interfaces/IBill";
import ID from "audio_diler_common/interfaces/ID";
import Logger from "../logger";

const billsRouter = express.Router();

billsRouter.use(jwtCheck);
billsRouter.use(dealerAuthCheck);

billsRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IBaseBill[]>) => {
    if (req.jwt === undefined)
    {
        throw new Error("Произошла попытка создания счета неавторизованным пользователем");
    }

    const bills = await DB.Bills.SelectByDealerID(req.jwt.id);

    res.json(bills);
}));

billsRouter.post("/new", expressAsyncHandler(async (req: RequestBody<IBill>, res: Response<ID>) => {
    if (req.jwt === undefined)
    {
        throw new Error("Произошла попытка создания счета неавторизованным пользователем");
    }
    
    const result = await DB.Bills.Insert(req.body);

    await DB.Bills.BillsDealers.Insert(req.jwt.id, result.id);

    res.json(result);
}));

billsRouter.get("/:billID", expressAsyncHandler(async (req: RequestBody, res: Response<IBill>) => {
    if (req.jwt === undefined)
    {
        throw new Error("Произошла попытка получения счета неавторизованным пользователем");
    }
    
    const bill = await DB.Bills.SelectDealerBill(Number(req.params.billID), req.jwt.id);

    res.json(bill);
}));

billsRouter.put("/:billID", expressAsyncHandler(async (req: RequestBody<IBill>, res: Response) => {
    await DB.Bills.Update(req.body);

    res.sendStatus(200);
}));

billsRouter.delete("/:billID", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    if (req.jwt === undefined)
    {
        throw new Error("Произошла попытка удаления счета неавторизованным пользователем");
    }
    
    const billID = Number(req.params.billID);

    await DB.Bills.BillsDealers.Delete(billID);

    await DB.Bills.Delete(billID);

    res.sendStatus(200);
}));

export default billsRouter;