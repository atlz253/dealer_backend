import express, { Response } from "express";
import RequestBody from "../../interfaces/RequestBody";
import expressAsyncHandler from "express-async-handler";
import DB from "../../DB/DB";
import createBufferDocument from "../../utils/createBufferDocument";

const chequesRouter = express.Router();

chequesRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const cheques = await DB.Cheques.Select({
        chequeStatus: (typeof req.query.chequeStatus === "string") ? req.query.chequeStatus : undefined
    });

    const rows: (string | number)[][] = [
        ["Номер", "Тип", "Статус оплаты", "Дата доставки"]
    ];

    cheques.forEach(cheque => rows.push([
        cheque.id,
        cheque.type === "sell" ? "Продажа" : "Покупка",
        cheque.status === "paid" ? "Оплачен" : "Не оплачен",
        cheque.deliveryDate
    ]));

    const buffer = createBufferDocument(rows)

    res.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
    res.end(Buffer.from(buffer, 'base64'));
}));

export default chequesRouter;