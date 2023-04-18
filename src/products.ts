import IBaseProduct from "audio_diler_common/interfaces/IBaseProduct";
import IProduct from "audio_diler_common/interfaces/IProduct";
import express, { Request, Response, response } from "express";
import dilerAuthCheck from "./dilerAuthCheck";
import jwtCheck from "./jwtCheck";
import IResponse from "audio_diler_common/interfaces/IResponse";
import pool from "./db";
import { error } from "console";

const productsRouter = express.Router();

productsRouter.use(jwtCheck);
productsRouter.use(dilerAuthCheck);

productsRouter.get('/', (req: Request, res: Response) => {
    pool.query('SELECT "productID" as "id", "name", "category", "price", "quantity", "description" FROM "Products"', (error, response) => {
        if (error) {
            const response: IResponse = {
                status: 400
            }

            return res.json(response);
        }

        // TODO: описать возвращаемый тип

        return res.json({
            status: 200,
            data: response.rows
        });
    });
});

productsRouter.get('/:productID', (req: Request, res: Response) => {
    pool.query(`SELECT "productID" as "id", "name", "category", "price", "quantity", "description" FROM "Products" WHERE "productID" = ${req.params.productID}`, (error, result) => {
        if (error) {
            console.error(error);

            const response: IResponse = {
                status: 400
            }

            return res.json(response);
        }

        // TODO: проверка на наличие записи

        return res.json({
            status: 200,
            data: result.rows[0]
        });
    });
});

productsRouter.post("/new", async (req: Request, res: Response) => {
    let productID: any;

    try {
        const result = await pool.query(`SELECT "categoryID" as "id" FROM "Categories" WHERE "name" = '${req.body.category}'`);

        console.log(result.rows);
    } catch (error) {
        console.log(error);
        
    }

    // if (productID === undefined) {
    //     pool.query(`INSERT INTO "Categories" ("name") VALUES ('${req.body.category}') RETURNING "categoryID" as "id"`, (error, result) => {
    //         if (error) {
    //             console.error(error);

    //             const response: IResponse = {
    //                 status: 400
    //             }

    //             return res.json(response);
    //         }

    //         productID = result.rows[0].id;
    //     });
    // }

    console.log(productID);

    pool.query(`INSERT INTO "Products" ("name", "price", "quantity", "description") VALUES ('${req.body.name}', '${req.body.price}', '${req.body.quantity}', '${req.body.description}') RETURNING "productID" as "id"`, (error, result) => {
        if (error) {
            // console.error(error);

            const response: IResponse = {
                status: 400
            }

            return res.json(response);
        }

        req.body.id = result.rows[0].id;

        return res.json(
            {
                status: 200,
                data: req.body
            }
        );
    });
});

productsRouter.put("/new", (req: Request, res: Response) => {
    pool.query(`UPDATE "Products" SET "name" = '${req.body.name}', "category" = '${req.body.category}', "price" = '${req.body.price}', "quantity" = '${req.body.quantity}', "description" = '${req.body.description}' WHERE "productID" = '${req.body.id}'`, (error, result) => {
        if (error) {
            console.error(error);

            const response: IResponse = {
                status: 400
            }

            return res.json(response);
        }

        const response: IResponse = {
            status: 200
        }

        return res.json(response);
    });
});

export default productsRouter;