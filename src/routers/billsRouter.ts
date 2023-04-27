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

// billsRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IBaseBill[]>) => {
//     if (req.jwt === undefined)
//     {
//         throw Error("Произошла попытка создания счета для неавторизованного пользователя");
//     }
    
//     const ownerID = await DB.Users.SelectIDByLogin(req.jwt.login);
    
//     const bills = await DB.Bills.SelectByID(ownerID);

//     res.json(bills);
// }));

// billsRouter.post("/new", expressAsyncHandler(async (req: RequestBody<IBill>, res: Response<ID>) => {
//     if (req.jwt === undefined)
//     {
//         throw Error("Произошла попытка создания счета для неавторизованного пользователя");
//     }
    
//     const ownerID = await DB.Users.SelectIDByLogin(req.jwt.login);

//     const result = await DB.Bills.Insert(req.body, req.jwt.type, ownerID);

//     res.json(result);
// }));

// billsRouter.get("/:billID", expressAsyncHandler(async (req: RequestBody, res: Response<IBill>) => {
//     const bill = await DB.Bills.Select(Number(req.params.billID));

//     res.json(bill);
// }));

billsRouter.put("/:billID", expressAsyncHandler(async (req: RequestBody<IBill>, res: Response) => {
    await DB.Bills.Update(req.body);

    res.sendStatus(200);
}));

billsRouter.delete("/:billID", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    await DB.Bills.Delete(Number(req.params.billID));

    res.sendStatus(200);
}));

export default billsRouter;