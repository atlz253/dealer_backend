import IContractProduct from "dealer_common/interfaces/IContractProduct";

interface ICheques {
    [day: number]: IContractProduct[]
}

export default ICheques;