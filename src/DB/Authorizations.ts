import { QueryConfig } from "pg";
import pool from "./pool";
import ID from "dealer_common/interfaces/ID";
import IAuthorization from "dealer_common/interfaces/IAuthorization";
import Logger from "../logger";

class Authorizations {
    public static async Insert(authorization: IAuthorization): Promise<number> {
        const query: QueryConfig = {
            text: `
                INSERT INTO
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

    public static async SelectIDByAuth(authorization: IAuthorization): Promise<number | null> {
        const query: QueryConfig = {
            text: `
                SELECT
                    authorization_id AS id
                FROM
                    authorizations
                WHERE
                    login = $1 AND
                    password = $2
            `,
            values: [
                authorization.login,
                authorization.password
            ]
        };
        
        const result = await pool.query<ID>(query);
        
        if (result.rowCount === 0) {
            return null;
        }
        
        return result.rows[0].id;
    }
    
    public static async Update(authorizationID: number, authorization: IAuthorization): Promise<void> {
        const query: QueryConfig = {
            text: `
                UPDATE
                    authorizations
                SET
                    login = $1,
                    password = $2
                WHERE
                    authorization_id = $3
            `,
            values: [
                authorization.login,
                authorization.password,
                authorizationID
            ]
        };
    
        await pool.query(query);
    }

    public static async Delete(id: number): Promise<void> {
        const query: QueryConfig = {
            text: `
                DELETE FROM
                    authorizations
                WHERE
                    authorization_id = $1;
            `,
            values: [
                id
            ]
        };
    
        await pool.query(query);
    }
}

export default Authorizations;