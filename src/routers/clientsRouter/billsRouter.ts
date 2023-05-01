import express, { Response } from "express";
import RequestBody from "../../interfaces/RequestBody";
import expressAsyncHandler from "express-async-handler";
import DB from "../../DB/DB";
import IBaseBill from "audio_diler_common/interfaces/IBaseBill";
import IBill from "audio_diler_common/interfaces/IBill";
import ID from "audio_diler_common/interfaces/ID";
import IBillNumber from "audio_diler_common/interfaces/IBillNumber";

const billsRouter = express.Router({ 
    mergeParams: true 
});

billsRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IBaseBill[] | IBillNumber[]>) => {
    const clientID = Number(req.params.clientID);

    if (req.query.onlyBillNumbers) {
        const billsNumbers = await DB.Bills.SelectBillsNumbersByClientID(clientID);

        res.json(billsNumbers);
    }
    else {
        const bills = await DB.Bills.SelectByClientID(clientID);

        res.json(bills);
    }
}));

billsRouter.post("/new", expressAsyncHandler(async (req: RequestBody<IBill>, res: Response<ID>) => {
    const clientID = Number(req.params.clientID);
    
    const billID = await DB.Bills.Insert(req.body);

    await DB.Bills.BillsClients.Insert(clientID, billID.id);

    res.json(billID);
}));

billsRouter.get("/:billID", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const billID = Number(req.params.billID);
    const clientID = Number(req.params.clientID);
    
    const bill = await DB.Bills.SelectClientBill(billID, clientID);
    
    res.json(bill);
}));

billsRouter.delete("/:billID", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const billID = Number(req.params.billID);
    const clientID = Number(req.params.clientID);

    await DB.Bills.BillsClients.Delete(clientID);

    await DB.Bills.Delete(billID);

    res.sendStatus(200);
}));

billsRouter.put("/:billID", expressAsyncHandler(async (req: RequestBody<IBill>, res: Response) => {
    await DB.Bills.Update(req.body);
    
    res.sendStatus(200);
}));

export default billsRouter;