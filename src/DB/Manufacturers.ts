import ID from "audio_diler_common/interfaces/ID";
import { QueryConfig } from "pg";
import pool from "./pool";

class Manufacturers {
    private static async InsertManufacturer(name: string): Promise<number> {
        const query: QueryConfig = {
            text: `
                INSERT INTO manufacturers 
                    (name) 
                VALUES 
                    ($1) 
                RETURNING 
                    manufacturer_id AS id
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
                    manufacturer_id as id 
                FROM 
                    manufacturers 
                WHERE 
                    name = $1
            `,
            values: [name]
        }

        const result = await pool.query<ID>(query);

        if (result.rowCount === 0) {
            return await this.InsertManufacturer(name);
        }

        return result.rows[0].id;
    }
}

export default Manufacturers;