import { QueryConfig } from "pg";
import pool from "./pool";
import IBaseClient from "audio_diler_common/interfaces/IBaseClient";

class Clients {
    public static async SelectAll(): Promise<IBaseClient[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    client_id AS id,
                    name,
                    phone,
                    added
                FROM
                    clients
            `
        };
    
        const result = await pool.query<IBaseClient>(query);
    
        return result.rows;
    }
}

export default Clients;