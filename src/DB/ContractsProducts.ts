import { QueryConfig } from "pg";
import pool from "./pool";
import format from "pg-format";
import Logger from "../logger";

class ContractsProducts {
    public static async Insert(contractID: number, productIDs: number[]): Promise<void> {
        const values = productIDs.map(productdID => [contractID, productdID]);
        
        const query = format(
        `
            INSERT INTO
                contracts_products (
                    contracts_contract_id,
                    products_product_id
                )
            VALUES
                %L
            `,
            values
        );

        await pool.query(query);
    }
}

export default ContractsProducts;