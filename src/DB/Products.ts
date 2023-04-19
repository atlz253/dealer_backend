import IProduct from "audio_diler_common/interfaces/IProduct";
import { QueryConfig } from "pg";
import pool from "./pool";
import ID from "audio_diler_common/interfaces/ID";
import DB from "./DB";
import IBaseProduct from "audio_diler_common/interfaces/IBaseProduct";
import IResponse from "audio_diler_common/interfaces/IResponse";

class Products {
    private static ConvertMoneyToNumber(money: any): number {
        return Number(money.toString().replace(" ?", "").replace(",", "."));
    }

    private static ConvertNumberToMoney(number: number): string {
        return number.toString().replace(".", ",");
    }

    public static async Insert(product: IProduct): Promise<number> {
        const categoryID = await DB.Categories.GetIDByName(product.category);
        const manufacturerID = await DB.Manufacturers.GetIDByName(product.manufacturer);
        const price = this.ConvertNumberToMoney(product.price);

        const query: QueryConfig = {
            text: `
                INSERT INTO 
                    products (
                        name, 
                        price, 
                        quantity, 
                        description, 
                        category_id,
                        manufacturer_id
                    ) 
                VALUES 
                    ($1, $2, $3, $4, $5, $6) 
                RETURNING 
                    product_id as id
            `,
            values: [product.name, price, product.quantity, product.description, categoryID, manufacturerID]
        }

        const result = await pool.query<ID>(query);

        return result.rows[0].id;
    }

    public static async SelectAll(): Promise<IBaseProduct[]> {
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
                    categories
                WHERE 
                    products.category_id = categories.category_id 
            `
        }

        const result = await pool.query<IBaseProduct>(query);

        for (let i = 0; i < result.rowCount; i++) {
            const row = result.rows[i];
            
            row.price = this.ConvertMoneyToNumber(row.price);
        }

        return result.rows;
    }

    public static async SelectByID(id: number): Promise<IProduct> {
        const query: QueryConfig = {
            text: `
                SELECT 
                    products.product_id as id, 
                    products.name, 
                    categories.name as category, 
                    products.price, 
                    products.quantity,
                    products.description,
                    manufacturers.name as manufacturer 
                FROM 
                    products, 
                    categories,
                    manufacturers
                WHERE
                    products.product_id = $1 AND 
                    products.category_id = categories.category_id AND
                    products.manufacturer_id = manufacturers.manufacturer_id
            `,
            values: [
                id
            ]
        }

        const result = await pool.query<IProduct>(query);

        for (let i = 0; i < result.rowCount; i++) {
            const row = result.rows[i];
            
            row.price = this.ConvertMoneyToNumber(row.price);
        }

        return result.rows[0];
    }

    public static async Update(product: IProduct): Promise<IResponse> {
        const categoryID = await DB.Categories.GetIDByName(product.category);
        const manufacturerID = await DB.Manufacturers.GetIDByName(product.manufacturer);
        const price = this.ConvertNumberToMoney(product.price);

        const query: QueryConfig = {
            text: `
                UPDATE 
                    products 
                SET 
                    name = $1, 
                    price = $2, 
                    quantity = $3, 
                    description = $4,
                    category_id = $5,
                    manufacturer_id = $6
                WHERE 
                    product_id = $7
            `,
            values: [
                product.name, 
                price, 
                product.quantity, 
                product.description, 
                categoryID, 
                manufacturerID, 
                product.id
            ]
        }

        pool.query(query);

        return {
            status: 200
        }
    }
}

export default Products;