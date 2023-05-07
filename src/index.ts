import express, { Express, Request, Response } from "express";
import cors from "cors";
import contractsRouter from "./routers/contractsRouter/contractsRouter";
import productsRouter from "./routers/productsRouter";
import bodyParser from "body-parser";
import { port } from "./config";
import loginRouter from "./routers/loginRouter";
import errorHandler from "./middleware/errorHandler";
import usersRouter from "./routers/usersRouter";
import DB from "./DB/DB";
import Logger from "./logger";
import httpLogger from "./middleware/httpLogger";
import billsRouter from "./routers/billsRouter";
import clientsRouter from "./routers/clientsRouter/clientsRouter";
import IUser from "audio_diler_common/interfaces/IUser";
import providersRouter from "./routers/providersRouter/providersRouter";

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(httpLogger);

app.use("/contracts", contractsRouter);
app.use("/products", productsRouter);
app.use("/clients", clientsRouter);
app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/bills", billsRouter);
app.use("/providers", providersRouter);

app.use(errorHandler);

app.listen(port, async () => {
  Logger.info(`API доступен по адресу http://localhost:${port}`);

  let firstAdmin: IUser | null = await DB.Admins.SelectByAuthID(1);

  if (firstAdmin === null) {
    firstAdmin = {
      id: 1,
      firstName: "admin",
      login: "admin",
      password: "admin",
      type: "admin"
    }

    await DB.Admins.Insert(firstAdmin);

    Logger.info("Создан аккаунт первого администратора");
  }
});
