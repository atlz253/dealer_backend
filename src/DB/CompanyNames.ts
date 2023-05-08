import { QueryConfig } from "pg";
import pool from "./pool";
import ID from "dealer_common/interfaces/ID";

class CompanyNames {
    private static async Insert(name: string): Promise<ID> {
        const query: QueryConfig = {
            text: `
                INSERT INTO
                    company_names (
                        company_name
                    )
                VALUES
                    ($1)
                RETURNING
                    company_name_id AS id
            `,
            values: [
                name
            ]
        };
    
        const result = await pool.query<ID>(query);
    
        return result.rows[0];
    }

    public static async SelectIDByName(name: string): Promise<ID> {
        const query: QueryConfig = {
            text: `
                SELECT
                    company_name_id AS id
                FROM
                    company_names
                WHERE
                    company_name = $1
            `,
            values: [
                name
            ]
        };
    
        const result = await pool.query<ID>(query);
    
        if (result.rowCount === 0) {
            return await this.Insert(name);
        }

        return result.rows[0];
    }
}

export default CompanyNames;