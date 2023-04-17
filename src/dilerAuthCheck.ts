import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./jwtCheck";
import IResponse from "audio_diler_common/interfaces/IResponse";

const dilerAuthCheck = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user === undefined) {
        const status: IResponse = {
            status: 401
        }

        return res.json(status);
    }

    if (req.user.role !== "diler") {
        const status: IResponse = {
            status: 401
        }

        return res.json(status);
    }

    next();
}

export default dilerAuthCheck; 