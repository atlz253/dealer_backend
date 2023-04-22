import { ErrorRequestHandler } from "express";
import Logger from "../logger";
import { DatabaseError } from "pg";

const errorHandler: ErrorRequestHandler = (error: Error, req, res, next) => {
    if (error instanceof DatabaseError) {
        const dbError = error as DatabaseError;

        Logger.error(dbError.message);
        Logger.error(dbError.detail);
        
        return res.sendStatus(400);
    }

    Logger.error((error.stack === undefined) ? error.message : error.stack);
    
    return res.sendStatus(400);
}

export default errorHandler;