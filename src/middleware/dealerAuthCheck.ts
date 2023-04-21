import { Response, NextFunction } from "express";
import { AuthRequest } from "./jwtCheck";

const dilerAuthCheck = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user === undefined) {
        return res.sendStatus(401);
    }

    if (req.user.type !== "dealer") {
        return res.sendStatus(401);
    }

    next();
}

export default dilerAuthCheck; 