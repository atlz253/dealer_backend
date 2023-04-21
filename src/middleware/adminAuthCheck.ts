import { Response, NextFunction } from "express";
import { AuthRequest } from "./jwtCheck";

const adminAuthCheck = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user === undefined) {
        return res.sendStatus(401);
    }

    if (req.user.type !== "admin") {
        return res.sendStatus(401);
    }

    next();
}

export default adminAuthCheck; 