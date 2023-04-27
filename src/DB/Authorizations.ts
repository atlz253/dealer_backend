import { QueryConfig } from "pg";
import pool from "./pool";
import ID from "audio_diler_common/interfaces/ID";
import IAuthorization from "audio_diler_common/interfaces/IAuthorization";

class Authorizations {
    public static async Insert(authorization: IAuthorization): Promise<number> {
        const query: QueryConfig = {
            text: `
                INSERT
                    authorizations (
                        login,
                        password
                    )
                VALUES
                    (
                        $1,
                        $2
                    )
                RETURNING 
                    authorization_id as id
            `,
            values: [
                authorization.login,
                authorization.password
            ]
        };
    
        const result = await pool.query<ID>(query);
    
        return result.rows[0].id;
    }
}

export default Authorizations;