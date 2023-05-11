import express, { Response } from "express";
import RequestBody from "../../interfaces/RequestBody";
import expressAsyncHandler from "express-async-handler";
import ICheque from "dealer_common/interfaces/ICheque";
import DB from "../../DB/DB";
import Logger from "../../logger";

const chequesRouter = express.Router({
    mergeParams: true
});

chequesRouter.put("/:chequeID", expressAsyncHandler(async (req: RequestBody<ICheque>, res: Response) => {
    const contractID = Number(req.params.contractID);

    await DB.Cheques.Update(req.body);

    DB.Products.UpdateQuantityByChequeID(req.body.id, req.body.type === "buy" ? "+" : "-");

    DB.Cheques.Select({contractID, chequeStatus: "unpaid"}).then(cheques => {
        if (cheques.length === 0) {
            DB.Contracts.UpdateStatus(contractID, "close");
        }
    });

    res.sendStatus(200);
}));

export default chequesRouter;