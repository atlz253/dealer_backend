import express, { Response } from "express";
import RequestBody from "../../interfaces/RequestBody";
import expressAsyncHandler from "express-async-handler";
import IBaseBill from "audio_diler_common/interfaces/IBaseBill";
import DB from "../../DB/DB";
import IBill from "audio_diler_common/interfaces/IBill";
import IBillNumber from "audio_diler_common/interfaces/IBillNumber";

const billsRouter = express.Router({ 
    mergeParams: true 
});

billsRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IBaseBill[] | IBillNumber[]>) => {
    const providerID = Number(req.params.providerID);
    
    if (req.query.onlyBillNumbers) {
        const numbers = await DB.Providers.Bills.SelectBillsNumbers(providerID);
    
        res.json(numbers);
    }
    else {
        const bills = await DB.Providers.Bills.SelectAll(providerID);

        res.json(bills);
    }
}));

billsRouter.get("/:billID", expressAsyncHandler(async (req: RequestBody, res: Response<IBill>) => {
    const providerID = Number(req.params.providerID);
    const billID = Number(req.params.billID);
    
    const bill = await DB.Providers.Bills.Select(billID, providerID);

    res.json(bill);
}));

billsRouter.put("/:billID", expressAsyncHandler(async (req: RequestBody<IBill>, res: Response) => {
    await DB.Providers.Bills.Update(req.body);

    res.sendStatus(200);
}));

billsRouter.delete("/:billID", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const billID = Number(req.params.billID);

    await DB.Providers.Bills.Delete(billID);

    res.sendStatus(200);
}));

billsRouter.post("/new", expressAsyncHandler(async (req: RequestBody<IBill>, res: Response) => {
    const providerID = Number(req.params.providerID);
    
    const id = await DB.Providers.Bills.Insert(req.body, providerID);

    res.json(id);
}));

export default billsRouter;