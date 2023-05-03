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
        const billsNumbers = await DB.Clients.Bills.SelectBillsNumbers(clientID);

        res.json(billsNumbers);
    }
    else {
        const bills = await DB.Clients.Bills.Select(clientID);

        res.json(bills);
    }
}));

billsRouter.post("/new", expressAsyncHandler(async (req: RequestBody<IBill>, res: Response<ID>) => {
    const clientID = Number(req.params.clientID);

    const billID = await DB.Clients.Bills.Insert(req.body, clientID);

    res.json(billID);
}));

billsRouter.get("/:billID", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const billID = Number(req.params.billID);
    const clientID = Number(req.params.clientID);
    
    const bill = await DB.Clients.Bills.SelectAll(billID, clientID);
    
    res.json(bill);
}));

billsRouter.delete("/:billID", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const billID = Number(req.params.billID);
    const clientID = Number(req.params.clientID);

    await DB.Clients.Bills.Delete(billID); // FIXME: проверка, что удаляется точно счёт клиента

    res.sendStatus(200);
}));

billsRouter.put("/:billID", expressAsyncHandler(async (req: RequestBody<IBill>, res: Response) => {
    await DB.Clients.Bills.Update(req.body);
    
    res.sendStatus(200);
}));

export default billsRouter;