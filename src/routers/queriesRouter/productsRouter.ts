import express, { Response } from "express";
import RequestBody from "../../interfaces/RequestBody";
import expressAsyncHandler from "express-async-handler";
import DB from "../../DB/DB";
import createProductsBufferDocument from "../../utils/createProductsBufferDocument";

const productsRouter = express.Router();

productsRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const products = await DB.Products.SelectAll({
        onlyAvaibleInStock: Boolean(req.query.onlyAvaibleInStock),
        avaibleForOrder: Boolean(req.query.avaibleForOrder) 
    });

    const buffer = createProductsBufferDocument(products);

    res.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
    res.end(Buffer.from(buffer, 'base64'));
}));

productsRouter.get("/processed", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const products = await DB.Cheques.Products.SelectAll({
        chequeStatus: "paid"
    });

    const buffer = createProductsBufferDocument(products);

    res.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
    res.end(Buffer.from(buffer, 'base64'));
}));

export default productsRouter;