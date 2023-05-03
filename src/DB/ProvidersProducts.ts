import { QueryConfig } from "pg";
import pool from "./pool";
import IBaseProduct from "audio_diler_common/interfaces/IBaseProduct";
import DBMoneyConverter from "../utils/DBMoneyConverter";

class ProvidersProducts {
    public static async SelectAll(providerID: number): Promise<IBaseProduct[]> {
        const query: QueryConfig = {
            text: `
                SELECT 
                    products.product_id as id, 
                    products.name, 
                    categories.name as category, 
                    products.price, 
                    products.quantity
                FROM 
                    products, 
                    categories,
                    providers_products
                WHERE 
                    products.category_id = categories.category_id AND
                    providers_products.products_product_id = products.product_id AND
                    providers_products.providers_provider_id = $1
            `,
            values: [
                providerID
            ]
        }
        
        const result = await pool.query<IBaseProduct>(query);

        for (let i = 0; i < result.rowCount; i++) {
            const row = result.rows[i];
            
            row.price = DBMoneyConverter.ConvertMoneyToNumber(row.price);
        }

        return result.rows;
    }

    public static async Insert(providerID: number, productID: number): Promise<void> {
        const query: QueryConfig = {
            text: `
                INSERT INTO
                    providers_products (
                        providers_provider_id,
                        products_product_id
                    )
                VALUES
                    ($1, $2)
            `,
            values: [
                providerID,
                productID
            ]
        }

        await pool.query(query);
    }

    public static async Delete(providerID: number, productID: number): Promise<void> {
        const query: QueryConfig = {
            text: `
                DELETE FROM
                    providers_products
                WHERE
                    providers_provider_id = $1 AND
                    products_product_id = $2
            `,
            values: [
                providerID,
                productID
            ]
        };
    
        await pool.query(query);
    }
}

export default ProvidersProducts;