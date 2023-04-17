import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import contractsRouter from "./contracts";
import productsRouter from "./products";
import bodyParser from "body-parser";
import { port } from "./config";
import loginRouter from "./login";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/contracts", contractsRouter);
app.use("/products", productsRouter)
app.use("/login", loginRouter);

app.get('/', (req: Request, res: Response) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
