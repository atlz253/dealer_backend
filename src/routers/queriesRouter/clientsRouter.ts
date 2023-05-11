import express, { Response } from "express";
import RequestBody from "../../interfaces/RequestBody";
import expressAsyncHandler from "express-async-handler";
import DB from "../../DB/DB";
import createBufferDocument from "../../utils/createBufferDocument";
import Logger from "../../logger";

const clientsRouter = express.Router();

clientsRouter.get("/requestedCategories", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const categories = await DB.Clients.SelectRequestedCategories();

    const rows = [
        ["Имя клиента", "Категория"]
    ];

    categories.forEach(item => rows.push([item.clientName, item.categoryName]));

    const buffer = createBufferDocument(rows)

    res.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
    res.end(Buffer.from(buffer, 'base64'));
}));

clientsRouter.get("/potential", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const clients = await DB.Clients.SelectPotentialClientsByProducts();

    const rows = [
        ["Имя клиента", "Наименование товара"]
    ];

    clients.forEach(item => rows.push([item.clientName, item.productName]));

    const buffer = createBufferDocument(rows)

    res.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
    res.end(Buffer.from(buffer, 'base64'));
}));

export default clientsRouter;