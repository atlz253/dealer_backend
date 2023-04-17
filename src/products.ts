import IBaseProduct from "audio_diler_common/interfaces/IBaseProduct";
import IProduct from "audio_diler_common/interfaces/IProduct";
import express, { Request, Response } from "express";
import dilerAuthCheck from "./dilerAuthCheck";
import jwtCheck from "./jwtCheck";
import IResponse from "audio_diler_common/interfaces/IResponse";

const productsRouter = express.Router();

productsRouter.use(jwtCheck);
productsRouter.use(dilerAuthCheck);

productsRouter.get('/', (req: Request, res: Response) => {
    const mockup: IBaseProduct[] = [
        {
            id: 0,
            name: "Lorem ipsum",
            category: "aboba",
            quantity: 10,
            price: 999
        },
        {
            id: 1,
            name: "Lorem ipsum",
            category: "aboba",
            quantity: 10,
            price: 999
        },
        {
            id: 2,
            name: "Lorem ipsum",
            category: "aboba",
            quantity: 10,
            price: 999
        },
        {
            id: 3,
            name: "Lorem ipsum",
            category: "aboba",
            quantity: 10,
            price: 999
        },
        {
            id: 4,
            name: "Lorem ipsum",
            category: "aboba",
            quantity: 10,
            price: 999
        },
    ];

    const request: IResponse<IBaseProduct[]> = {
        status: 200,
        data: mockup
    }

    res.send(request);
});

productsRouter.get('/:productID', (req: Request, res: Response) => {
    const mockup: IProduct = {
        id: Number(req.params.productID),
        name: "Lorem ipsum",
        category: "aboba",
        quantity: 10,
        price: 999,
        description: "src/products.ts(45,11): error TS2741: Property 'description' is missing in type '{ id: number; name: string; quantity: number; price: number; }' but required in type 'IProduct'."
    };

    const request: IResponse<IProduct> = {
        status: 200,
        data: mockup
    }

    res.send(request);
});

export default productsRouter;