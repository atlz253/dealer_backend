import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./jwtCheck";
import IResponse from "audio_diler_common/interfaces/IResponse";

const dilerAuthCheck = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user === undefined) {
        return res.sendStatus(401);
    }

    if (req.user.role !== "dealer") {
        return res.sendStatus(401);
    }

    next();
}

export default dilerAuthCheck; 