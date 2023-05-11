import express, { Response } from "express";
import RequestBody from "../../interfaces/RequestBody";
import expressAsyncHandler from "express-async-handler";
import jwtCheck from "../../middleware/jwtCheck";
import dealerAuthCheck from "../../middleware/dealerAuthCheck";
import productsRouter from "./productsRouter";
import queriesList from "./queriesList";
import IQueriesCategory from "dealer_common/interfaces/IQueriesCategory";
import clientsRouter from "./clientsRouter";
import chequesRouter from "./chequesRouter";
import contractsRouter from "./contractsRouter";

const queriesRouter = express.Router();

queriesRouter.use(jwtCheck);
queriesRouter.use(dealerAuthCheck);

queriesRouter.use("/clients", clientsRouter);
queriesRouter.use("/cheques", chequesRouter);
queriesRouter.use("/products", productsRouter);
queriesRouter.use("/contracts", contractsRouter);

queriesRouter.get("/", expressAsyncHandler(async (req: RequestBody, res: Response<IQueriesCategory[]>) => {
    res.json(queriesList);
}));

export default queriesRouter;