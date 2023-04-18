import { Request } from "express"

interface RequestBody<T = any> extends Request {
    body: T
}

export default RequestBody;