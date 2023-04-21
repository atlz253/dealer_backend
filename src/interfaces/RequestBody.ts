import { Request } from "express"
import IJWT from "./IJWT";

interface RequestBody<T = any> extends Request {
    body: T,
    jwt?: IJWT
}

export default RequestBody;