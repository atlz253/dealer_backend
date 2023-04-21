import IBaseProduct from "audio_diler_common/interfaces/IBaseProduct";
import IProduct from "audio_diler_common/interfaces/IProduct";
import express, { NextFunction, Request, Response, response } from "express";
import dilerAuthCheck from "../middleware/dealerAuthCheck";
import jwtCheck from "../middleware/jwtCheck";
import IResponse from "audio_diler_common/interfaces/IResponse";
import pool from "../DB/pool";
import { error } from "console";
import DB from "../DB/DB";
import ID from "audio_diler_common/interfaces/ID";
import RequestBody from "../interfaces/RequestBody";
import expressAsyncHandler from "express-async-handler";

const productsRouter = express.Router();

productsRouter.use(jwtCheck);
productsRouter.use(dilerAuthCheck);

productsRouter.get('/', expressAsyncHandler(async (req: RequestBody, res: Response<IBaseProduct[]>, next: NextFunction) => {
    const products = await DB.Products.SelectAll();

    res.json(products);
}));

productsRouter.get('/:productID', expressAsyncHandler(async (req: RequestBody, res: Response<IProduct>) => {
    const product = await DB.Products.SelectByID(Number(req.params.productID));

    res.json(product);
}));

productsRouter.post("/new", expressAsyncHandler(async (req: RequestBody<IProduct>, res: Response<ID>) => {
    const id = await DB.Products.Insert(req.body);

    res.json(id);
}));

productsRouter.put("/:productID", expressAsyncHandler(async (req: RequestBody<IProduct>, res: Response<IResponse>) => {
    await DB.Products.Update(req.body);

    res.sendStatus(200);
}));

productsRouter.delete("/:productID", expressAsyncHandler(async (req: RequestBody, res: Response<IResponse>) => {
    await DB.Products.Delete(Number(req.params.productID));

    res.sendStatus(200);
}));

export default productsRouter;