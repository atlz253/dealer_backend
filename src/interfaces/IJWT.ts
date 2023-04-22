import IUserAuthInfo from "./IUserAuthInfo";

interface IJWT extends IUserAuthInfo {
    iat: number
}

export default IJWT;