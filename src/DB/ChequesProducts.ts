import pool from "./pool";
import format from "pg-format";
import IContractProduct from "dealer_common/interfaces/IContractProduct";
import IBaseProduct from "dealer_common/interfaces/IBaseProduct";
import DBMoneyConverter from "../utils/DBMoneyConverter";

interface ISelectParams {
    chequeStatus: string,
    contractType: string
}

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

    public static async SelectAll(params?: Partial<ISelectParams>): Promise<IBaseProduct[]> { // TODO: Хорошо бы переписать этот метод в параметры для Select в Products
        const queryParams = params ? 
            format(
                `
                    %s
                    %s
                `,
                params.chequeStatus ? format("AND cheques.status = %L", params.chequeStatus) : "",
                params.contractType ? format("AND contracts.type = %L", params.contractType) : ""
            )
            :
            "";
        
        const query = format(
            `
                SELECT 
                    products.product_id as id, 
                    products.name, 
                    categories.name as category, 
                    products.price * cheques_products.product_quantity AS price, 
                    cheques_products.product_quantity AS quantity
                FROM
                    cheques,
                    products, 
                    contracts,
                    categories,
                    cheques_products
                WHERE 
                    cheques.contract_id = contracts.contract_id AND
                    products.category_id = categories.category_id AND
                    cheques_products.cheques_cheque_id = cheques.cheque_id AND
                    cheques_products.products_product_id = products.product_id
                    %s
            `,
            queryParams
        );

        const result = await pool.query<IBaseProduct>(query);

        for (let i = 0; i < result.rowCount; i++) {
            const row = result.rows[i];

            row.price = DBMoneyConverter.ConvertMoneyToNumber(row.price);
        }

        return result.rows;
    }
}

export default ChequesProducts;