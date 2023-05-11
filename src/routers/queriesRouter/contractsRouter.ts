import express, { Response } from "express";
import RequestBody from "../../interfaces/RequestBody";
import expressAsyncHandler from "express-async-handler";
import DB from "../../DB/DB";
import createBufferDocument from "../../utils/createBufferDocument";

const contractsRouter = express.Router();

contractsRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const contracts = await DB.Contracts.Select();

    const rows: (number | string | undefined)[][] = [
        ["Номер договора", "Продавец", "Покупатель", "Тип договора", "Статус", "Сумма", "Дата создания"]
    ];

    contracts.forEach(contract => rows.push([
        contract.id,
        contract.sellerName,
        contract.buyerName,
        contract.type === "sell" ? "Продажа" : "Покупка",
        contract.status === "open" ? "Открыт" : "Закрыт",
        contract.price,
        contract.created
    ]));

    const buffer = createBufferDocument(rows)

    res.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
    res.end(Buffer.from(buffer, 'base64'));
}));

export default contractsRouter;