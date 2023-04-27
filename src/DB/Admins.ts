import { QueryConfig } from "pg";
import pool from "./pool";
import IAdmin from "audio_diler_common/interfaces/IAdmin";
import ID from "audio_diler_common/interfaces/ID";
import DB from "./DB";

class Admins {
    public static async Insert(admin: IAdmin): Promise<number> {
        const nameID = await DB.FirstNames.GetIDByName(admin.firstName);
        
        const query: QueryConfig = {
            text: `
                INSERT
                    admins (
                        first_name_id
                        authorization_id
                    )
                VALUES
                    (
                        $1,
                        $2
                    )
                RETURNING
                    admin_id AS id
            `,
            values: [
                nameID // TODO: authorizationID
            ]
        };
    
        const result = await pool.query<ID>(query);
    
        return result.rows[0].id;
    }
}

export default Admins;