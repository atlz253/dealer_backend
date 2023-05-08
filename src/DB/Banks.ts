import ID from "dealer_common/interfaces/ID";
import { QueryConfig } from "pg";
import pool from "./pool";
import Logger from "../logger";

class Banks {
    private static async Insert(name: string): Promise<number> {
        const query: QueryConfig = {
            text: `
                INSERT INTO
                    banks (
                        name
                    )
                VALUES
                    ($1)
                RETURNING
                    bank_id AS id
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
                    bank_id AS id
                FROM
                    banks
                WHERE
                    name = $1
            `,
            values: [name]
        };

        const result = await pool.query<ID>(query);

        if (result.rowCount === 0) {
            return await this.Insert(name);
        }

        return result.rows[0].id;
    }
}

export default Banks;