import { QueryConfig } from "pg";
import pool from "./pool";
import ID from "dealer_common/interfaces/ID";

class FirstNames {
    private static async Insert(firstName: string): Promise<number> {
        const query: QueryConfig = {
            text: `
                INSERT INTO
                    first_names (
                        first_name
                    )
                VALUES
                    (
                        $1
                    )
                RETURNING
                    first_name_id AS id
            `,
            values: [
                firstName
            ]
        };
    
        const result = await pool.query<ID>(query);
    
        return result.rows[0].id;
    }

    public static async SelectIDByName(firstName: string): Promise<number> {
        const query: QueryConfig = {
            text: `
            SELECT 
                first_name_id AS id 
            FROM 
                first_names 
            WHERE 
                first_name = $1
            `,
            values: [
                firstName
            ]
        };
    
        const result = await pool.query<ID>(query);
    
        if (result.rowCount === 0) {
            return await this.Insert(firstName);
        }

        return result.rows[0].id;
    }
}

export default FirstNames;