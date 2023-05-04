import { QueryConfig } from "pg";
import pool from "./pool";
import IDealer from "audio_diler_common/interfaces/IDealer";
import ID from "audio_diler_common/interfaces/ID";
import IAuthorization from "audio_diler_common/interfaces/IAuthorization";
import DB from "./DB";
import BillsDealers from "./BillsDealers";

class Dealers {
    public static get Bills(): typeof BillsDealers {
        return BillsDealers;
    }

    public static async Insert(dealer: IDealer): Promise<number> {
        const nameID = await DB.FirstNames.SelectIDByName(dealer.firstName);

        if (dealer.login === undefined || dealer.password === undefined) {
            throw new Error("Не были переданы данные для авторизации пользователя");
        }

        const authorization: IAuthorization = {login: dealer.login, password: dealer.password};

        const authorizationID: number | null = await DB.Autorizations.Insert(authorization);

        const query: QueryConfig = {
            text: `
                INSERT INTO
                    dealers (
                        first_name_id,
                        authorization_id,
                        employment_date
                    )
                VALUES
                    ($1, $2, $3)
            `,
            values: [
                nameID,
                authorizationID,
                dealer.employmentDate
            ]
        };
    
        await pool.query(query);
    
        return authorizationID;
    }

    public static async Select(): Promise<IDealer[]> {
        const query: QueryConfig = {
            text: `
            SELECT
                authorizations.login,
                dealers.authorization_id AS id,
                first_names.first_name AS "firstName",
                'dealer' AS type
            FROM
                dealers,
                first_names,
                authorizations
            WHERE
                dealers.first_name_id = first_names.first_name_id AND 
                dealers.authorization_id = authorizations.authorization_id
            `
        };
    
        const result = await pool.query<IDealer>(query);
    
        return result.rows;
    }

    public static async SelectByAuthID(authID: number): Promise<IDealer | null> {
        const query: QueryConfig = {
            text: `
                SELECT
                    dealers.authorization_id AS id,
                    dealers.employment_date AS "employmentDate",
                    first_names.first_name AS "firstName",
                    authorizations.login,
                    authorizations.password,
                    'dealer' AS type
                FROM
                    dealers,
                    first_names,
                    authorizations
                WHERE
                    dealers.authorization_id = $1 AND
                    dealers.authorization_id = authorizations.authorization_id AND
                    dealers.first_name_id = first_names.first_name_id
            `,
            values: [
                authID
            ]
        };
    
        const result = await pool.query<IDealer>(query);
    
        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    }

    public static async SelectIDByAuthID(authID: number): Promise<ID | null> {
        const query: QueryConfig = {
            text: `
                SELECT
                    dealer_id AS id
                FROM
                    dealers
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

    public static async SelectNameByAuthID(authID: number): Promise<string> {
        const query: QueryConfig = {
            text: `
                SELECT
                    first_names.first_name AS "firstName"
                FROM
                    dealers,
                    first_names
                WHERE
                    dealers.authorization_id = $1 AND
                    dealers.first_name_id = first_names.first_name_id
            `,
            values: [
                authID
            ]
        };
    
        const result = await pool.query<{firstName: string}>(query);
    
        return result.rows[0].firstName;
    }

    public static async Update(dealer: IDealer): Promise<void> {
        const nameID = await DB.FirstNames.SelectIDByName(dealer.firstName);
        
        if (dealer.login === undefined || dealer.password === undefined) {
            throw new Error("Не были переданные данные авторизации пользователя");
        }

        await DB.Autorizations.Update(dealer.id, {login: dealer.login, password: dealer.password})

        const query: QueryConfig = {
            text: `
                UPDATE
                    dealers
                SET
                    employment_date = $1,
                    first_name_id = $2
                WHERE
                    authorization_id = $3
            `,

            values: [
                dealer.employmentDate,
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
                    dealers
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

export default Dealers;