import express, { Response } from "express";
import expressAsyncHandler from "express-async-handler";
import RequestBody from "../interfaces/RequestBody";
import IBaseBill from "dealer_common/interfaces/IBaseBill";
import DB from "../DB/DB";
import jwtCheck from "../middleware/jwtCheck";
import dealerAuthCheck from "../middleware/dealerAuthCheck";
import IBill from "dealer_common/interfaces/IBill";
import ID from "dealer_common/interfaces/ID";
import Logger from "../logger";
import IBillNumber from "dealer_common/interfaces/IBillNumber";

const billsRouter = express.Router();

billsRouter.use(jwtCheck);
billsRouter.use(dealerAuthCheck);

billsRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IBaseBill[] | IBillNumber[]>) => {
    if (req.jwt === undefined) {
        throw new Error("Произошла попытка создания счета неавторизованным пользователем");
    }

    if (req.query.onlyBillNumbers) {
        const billsNumbers = await DB.Dealers.Bills.SelectBillsNumbers(req.jwt.id);

        res.json(billsNumbers);
    }
    else {
        const bills = await DB.Dealers.Bills.SelectAll(req.jwt.id);

        res.json(bills);
    }
}));

billsRouter.post("/new", expressAsyncHandler(async (req: RequestBody<IBill>, res: Response<ID>) => {
    if (req.jwt === undefined) {
        throw new Error("Произошла попытка создания счета неавторизованным пользователем");
    }

    const result = await DB.Dealers.Bills.Insert(req.body, req.jwt.id);

    res.json(result);
}));

billsRouter.get("/:billID", expressAsyncHandler(async (req: RequestBody, res: Response<IBill>) => {
    if (req.jwt === undefined) {
        throw new Error("Произошла попытка получения счета неавторизованным пользователем");
    }

    const bill = await DB.Dealers.Bills.Select(Number(req.params.billID), req.jwt.id);

    res.json(bill);
}));

billsRouter.put("/:billID", expressAsyncHandler(async (req: RequestBody<IBill>, res: Response) => {
    await DB.Dealers.Bills.Update(req.body);

    res.sendStatus(200);
}));

billsRouter.delete("/:billID", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    if (req.jwt === undefined) {
        throw new Error("Произошла попытка удаления счета неавторизованным пользователем");
    }

    const billID = Number(req.params.billID);

    await DB.Dealers.Bills.Delete(billID);

    res.sendStatus(200);
}));

export default billsRouter;