import { QueryConfig } from "pg";
import pool from "./pool";
import ID from "dealer_common/interfaces/ID";

class Categories {
    private static async InsertCategory(name: string): Promise<number> {
        const query: QueryConfig = {
            text: `
                INSERT INTO categories 
                    (name) 
                VALUES 
                    ($1) 
                RETURNING 
                    category_id 
                AS 
                    id
            `,
            values: [name]
        }

        const result = await pool.query<ID>(query);

        return result.rows[0].id;
    }

    public static async GetIDByName(name: string): Promise<number> {
        const query: QueryConfig = {
            text: `
                SELECT 
                    category_id as id 
                FROM 
                    categories 
                WHERE 
                    name = $1
            `,
            values: [name]
        }

        const result = await pool.query<ID>(query);

        if (result.rowCount === 0) {
            return await this.InsertCategory(name);
        }

        return result.rows[0].id;
    }
}

export default Categories;