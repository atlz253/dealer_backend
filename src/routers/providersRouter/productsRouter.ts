import express, { Response } from "express";
import RequestBody from "../../interfaces/RequestBody";
import expressAsyncHandler from "express-async-handler";
import IBaseProduct from "audio_diler_common/interfaces/IBaseProduct";
import DB from "../../DB/DB";
import Logger from "../../logger";

const productsRouter = express.Router({ 
    mergeParams: true 
});

productsRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IBaseProduct[]>) => {
    const providerID = Number(req.params.providerID);

    const products = await DB.Providers.Products.SelectAll(providerID);

    res.json(products);
}));

productsRouter.put("/:productID", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const productID = Number(req.params.productID);
    const providerID = Number(req.params.providerID);
    

    await DB.Providers.Products.Insert(providerID, productID);

    res.sendStatus(200);
}));

productsRouter.delete("/:productID", expressAsyncHandler(async (req: RequestBody, res: Response) => {
    const productID = Number(req.params.productID);
    const providerID = Number(req.params.providerID);

    await DB.Providers.Products.Delete(providerID, productID);

    res.sendStatus(200);
}));

export default productsRouter;