import IBaseProduct from "audio_diler_common/interfaces/IBaseProduct";
import IProduct from "audio_diler_common/interfaces/IProduct";
import express, { Request, Response, response } from "express";
import dilerAuthCheck from "./dilerAuthCheck";
import jwtCheck from "./jwtCheck";
import IResponse from "audio_diler_common/interfaces/IResponse";
import pool from "./DB/pool";
import { error } from "console";
import DB from "./DB/DB";
import ID from "audio_diler_common/interfaces/ID";
import RequestBody from "./interfaces/RequestBody";

const productsRouter = express.Router();

productsRouter.use(jwtCheck);
productsRouter.use(dilerAuthCheck);

productsRouter.get('/', async (req: RequestBody, res: Response<IResponse<IBaseProduct[]>>) => {
    try {
        const products = await DB.Products.SelectAll();

        return res.json({
            status: 200,
            data: products
        })
    } catch (error) {
        console.error(error);
        
        return res.json({
            status: 400
        });
    }
});

productsRouter.get('/:productID', async (req: RequestBody, res: Response<IResponse<IProduct>>) => {
    try {
        const product = await DB.Products.SelectByID(Number(req.params.productID));

        return res.json({
            status: 200,
            data: product
        });
    } catch (error) {
        console.error(error);
        
        return res.json({
            status: 400
        });
    }
});

productsRouter.post("/new", async (req: RequestBody<IProduct>, res: Response<IResponse<ID>>) => {
    try {
        const id = await DB.Products.Insert(req.body);

        return res.json({
            status: 200,
            data: { id }
        });
    } catch (error) {
        console.error(error);

        return res.json({
            status: 400
        });
    }
});

productsRouter.put("/:productID", async (req: RequestBody<IProduct>, res: Response<IResponse>) => {
    try {
        const result = await DB.Products.Update(req.body);

        return res.json(result);
    } catch (error) {
        console.error(error);
        
        return res.json({
            status: 400
        });
    }
});

productsRouter.delete("/:productID", async (req: RequestBody, res: Response<IResponse>) => {
    try {
        await DB.Products.Delete(Number(req.params.productID));

        return res.json({
            status: 200
        });
    } catch (error) {
        console.error(error);
        
        return res.json({
            status: 400
        });
    }
});

export default productsRouter;