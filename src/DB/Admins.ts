import { QueryConfig } from "pg";
import pool from "./pool";
import ID from "audio_diler_common/interfaces/ID";
import DB from "./DB";
import IUser from "audio_diler_common/interfaces/IUser";
import IAuthorization from "audio_diler_common/interfaces/IAuthorization";

class Admins {
    public static async Insert(admin: IUser): Promise<number> {
        const nameID = await DB.FirstNames.SelectIDByName(admin.firstName);

        if (admin.login === undefined || admin.password === undefined) {
            throw new Error("Не были переданы данные для авторизации пользователя");
        }

        const authorization: IAuthorization = {login: admin.login, password: admin.password};

        const authorizationID: number | null = await DB.Autorizations.Insert(authorization);

        const query: QueryConfig = {
            text: `
                INSERT INTO
                    admins (
                        first_name_id,
                        authorization_id
                    )
                VALUES
                    ($1, $2)
                RETURNING
                    admin_id AS id
            `,
            values: [
                nameID,
                authorizationID
            ]
        };
    
        await pool.query(query);
    
        return authorizationID;
    }

    public static async SelectByAuthID(authID: number): Promise<IUser | null> {
        const query: QueryConfig = {
            text: `
                SELECT
                    admins.admin_id AS id,
                    first_names.first_name AS "firstName",
                    authorizations.login,
                    authorizations.password,
                    'admin' AS type
                FROM
                    admins,
                    first_names,
                    authorizations
                WHERE
                    admins.authorization_id = $1 AND
                    admins.authorization_id = authorizations.authorization_id AND
                    admins.first_name_id = first_names.first_name_id
            `,
            values: [
                authID
            ]
        };
    
        const result = await pool.query<IUser>(query);
    
        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    }

    public static async SelectIDByAuthID(authID: number): Promise<ID | null> {
        const query: QueryConfig = {
            text: `
                SELECT
                    admin_id AS id
                FROM
                    admins
                WHERE
                    authorization_id = $1
            `,
            values: [
                authID
            ]
        };
    
        const result = await pool.query<ID>(query);
    
        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    }

    public static async Select(): Promise<IUser[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    authorizations.login,
                    authorizations.authorization_id AS id,
                    first_names.first_name AS "firstName",
                    'admin' AS type
                FROM
                    admins,
                    first_names,
                    authorizations
                WHERE
                    admins.first_name_id = first_names.first_name_id AND 
                    admins.authorization_id = authorizations.authorization_id
            `
        };
    
        const result = await pool.query<IUser>(query);
    
        return result.rows;
    }

    public static async Update(dealer: IUser): Promise<void> {
        const nameID = await DB.FirstNames.SelectIDByName(dealer.firstName);
        
        if (dealer.login === undefined || dealer.password === undefined) {
            throw new Error("Не были переданные данные авторизации пользователя");
        }

        await DB.Autorizations.Update(dealer.id, {login: dealer.login, password: dealer.password})

        const query: QueryConfig = {
            text: `
                UPDATE
                    admins
                SET
                    first_name_id = $1
                WHERE
                    authorization_id = $2
            `,

            values: [
                nameID,
                dealer.id
            ]
        };
    
        await pool.query(query);
    }

    public static async Delete(id: number): Promise<void> {
        const query: QueryConfig = {
            text: `
                DELETE FROM
                    admins
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

export default Admins;