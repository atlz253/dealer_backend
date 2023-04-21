import { QueryConfig } from "pg";
import pool from "./pool";
import ID from "audio_diler_common/interfaces/ID";

class UserTypes {
    private static async Insert(name: string): Promise<number> {
        const query: QueryConfig = {
            text: `
                INSERT INTO user_types
                    (name)
                VALUES
                    ($1)
                RETURNING 
                user_type_id 
                AS 
                    id
            `,
            values: [name]
        };

        const result = await pool.query<ID>(query);

        return result.rows[0].id;
    }
    
    public static async GetIDNyName(name: string): Promise<number> {
        const query: QueryConfig = {
            text: `
                SELECT
                    user_type_id AS id
                FROM
                    user_types
                WHERE
                    name = $1
            `,
            values: [name]
        };

        const result = await pool.query<ID>(query);

        if (result.rowCount === 0) {
            return this.Insert(name);
        }

        return result.rows[0].id;
    }
}

export default UserTypes;