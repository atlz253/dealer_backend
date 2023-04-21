import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    
    return res.sendStatus(400);
}

export default errorHandler;