import express, { Express, Request, Response } from "express";
import cors from "cors";
import contractsRouter from "./contracts";
import productsRouter from "./products";

const app: Express = express();
const port = 2727

app.use(cors());

app.use('/contracts', contractsRouter);
app.use("/products", productsRouter)

app.get('/', (req: Request, res: Response) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
