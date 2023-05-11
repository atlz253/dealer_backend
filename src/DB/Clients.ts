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

    public static async SelectRequestedCategories(): Promise<{clientName: string, categoryName: string}[]> {
        const query: QueryConfig = {
            text: `
                SELECT DISTINCT
                    first_names.first_name AS "clientName",
                    categories.name AS "categoryName"
                FROM
                    bills,
                    clients,
                    cheques,
                    products,
                    contracts,
                    categories,
                    first_names,
                    bills_clients,
                    cheques_products
                WHERE
                    bills.bill_id = contracts.buyer_bill_id AND
                    bills.bill_id = bills_clients.bills_bill_id AND
                    clients.client_id = bills_clients.clients_client_id AND
                    first_names.first_name_id = clients.first_name_id AND
                    cheques.contract_id = contracts.contract_id AND
                    cheques.cheque_id = cheques_products.cheques_cheque_id AND
                    products.product_id = cheques_products.products_product_id AND
                    products.category_id = categories.category_id
            `
        };
    
        const result = await pool.query<{clientName: string, categoryName: string}>(query);
    
        return result.rows;
    }

    public static async SelectPotentialClientsByProducts(): Promise<{clientName: string, productName: string}[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    first_names.first_name AS "clientName",
                    products.name AS "productName"
                FROM
                    bills,
                    cheques,
                    clients,
                    products,
                    contracts,
                    first_names,
                    bills_clients,
                    cheques_products
                WHERE
                    cheques.status = 'unpaid' AND
                    bills.bill_id = contracts.buyer_bill_id AND
                    bills.bill_id = bills_clients.bills_bill_id AND
                    clients.client_id = bills_clients.clients_client_id AND
                    clients.first_name_id = first_names.first_name_id AND
                    cheques.contract_id = contracts.contract_id AND
                    cheques.cheque_id = cheques_products.cheques_cheque_id AND
                    products.product_id = cheques_products.products_product_id
            `
        };
    
        const result = await pool.query<{clientName: string, productName: string}>(query);
    
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