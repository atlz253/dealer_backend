import { QueryConfig } from "pg";
import pool from "./pool";
import format from "pg-format";
import ID from "audio_diler_common/interfaces/ID";
import IQuantity from "audio_diler_common/interfaces/IQuantity";
import IContractProduct from "audio_diler_common/interfaces/IContractProduct";

class ChequesProducts {
    public static async Insert(chequeID: number, products: IContractProduct[]): Promise<void> {
        const values = products.map(product => [chequeID, product.id, product.quantity]);

        const query = format(
            `
                INSERT INTO 
                    cheques_products (
                        cheques_cheque_id,
                        products_product_id,
                        product_quantity
                    )
                VALUES
                    %L
            `,
            values
        );

        await pool.query(query);
    }
}

export default ChequesProducts;