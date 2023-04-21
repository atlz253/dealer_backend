import { ErrorRequestHandler } from "express";
import Logger from "../logger";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    Logger.error(err);
    
    return res.sendStatus(400);
}

export default errorHandler;