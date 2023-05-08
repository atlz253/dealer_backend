import { QueryConfig } from "pg";
import pool from "./pool";
import IBaseClient from "dealer_common/interfaces/IBaseClient";
import IClient from "dealer_common/interfaces/IClient";
import ID from "dealer_common/interfaces/ID";
import DB from "./DB";
import IName from "dealer_common/interfaces/IName";
import BillsClients from "./BillsClients";
import ICount from "dealer_common/interfaces/ICount";

class Clients {
    public static get Bills(): typeof BillsClients {
        return BillsClients;
    }

    public static async SelectAll(): Promise<IBaseClient[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    client_id AS id,
                    first_names.first_name AS "name",
                    phone,
                    added
                FROM
                    clients,
                    first_names
                WHERE
                    clients.first_name_id = first_names.first_name_id
            `
        };
    
        const result = await pool.query<IBaseClient>(query);
    
        return result.rows;
    }

    public static async Select(id: number): Promise<IClient> {
        const query: QueryConfig = {
            text: `
                SELECT
                    clients.client_id AS id,
                    first_names.first_name AS name,
                    clients.phone,
                    clients.added,
                    clients.email,
                    clients.birthday,
                    clients.address
                FROM
                    clients,
                    first_names
                WHERE
                    clients.client_id = $1 AND
                    clients.first_name_id = first_names.first_name_id
            `,
            values: [
                id
            ]
        };
    
        const result = await pool.query<IClient>(query);
    
        return result.rows[0];
    }

    public static async SelectCount(): Promise<ICount> {
        const query: QueryConfig = {
            text: `
                SELECT
                    COUNT(*)
                FROM
                    clients
            `
        };
    
        const result = await pool.query<ICount>(query);
    
        return result.rows[0];
    }

    public static async SelectNames(): Promise<IName[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    clients.client_id AS id,
                    first_names.first_name AS "name"
                FROM
                    clients,
                    first_names
                WHERE
                    clients.first_name_id = first_names.first_name_id
            `
        };
    
        const result = await pool.query<IName>(query);
    
        return result.rows;
    }

    public static async Insert(client: IClient): Promise<ID> {
        const nameID = await DB.FirstNames.SelectIDByName(client.name);
        
        const added = new Date().toISOString();

        const query: QueryConfig = {
            text: `
                INSERT INTO
                    clients (
                        first_name_id,
                        phone,
                        email,
                        birthday,
                        address,
                        added
                    )
                VALUES
                    ($1, $2, $3, $4, $5, $6)
                RETURNING
                    client_id AS id
            `,
            values: [
                nameID,
                client.phone,
                client.email,
                client.birthday,
                client.address,
                added
            ]
        };
    
        const result = await pool.query<ID>(query);
    
        return result.rows[0];
    }

    public static async Update(client: IClient): Promise<void> {
        const nameID = await DB.FirstNames.SelectIDByName(client.name);

        const query: QueryConfig = {
            text: `
                UPDATE
                    clients
                SET
                    first_name_id = $1,
                    phone = $2,
                    email = $3,
                    birthday = $4,
                    address = $5
                WHERE
                    client_id = $6
            `,
            values: [
                nameID,
                client.phone,
                client.email,
                client.birthday,
                client.address,
                client.id
            ]
        };
    
        await pool.query(query);
    }

    public static async Delete(id: number): Promise<void> {
        const query: QueryConfig = {
            text: `
                DELETE FROM
                    clients
                WHERE
                    client_id = $1
            `,
            values: [
                id
            ]
        };
    
        await pool.query(query);
    }
}

export default Clients;