import { QueryConfig } from "pg";
import pool from "./pool";
import IBaseBill from "dealer_common/interfaces/IBaseBill";
import IBill from "dealer_common/interfaces/IBill";
import IBillNumber from "dealer_common/interfaces/IBillNumber";
import Bills from "./Bills";
import ID from "dealer_common/interfaces/ID";

class BillsClients extends Bills {
    public static async SelectAll(billID: number, clientID: number): Promise<IBill> {
        const query: QueryConfig = {
            text: `
                SELECT
                    bills.bill_id AS id,
                    bills.bill_number AS "billNumber",
                    banks.name AS "bankName",
                    bills.expires AS "expireDate",
                    bills.correspondent_bill AS "correspondentBill",
                    bills.bic AS "BIC",
                    bills.inn AS "INN",
                    first_names.first_name AS "ownerName"
                FROM
                    bills,
                    banks,
                    clients,
                    first_names
                WHERE
                    bills.bill_id = $1 AND
                    clients.client_id = $2 AND
                    bills.bank_id = banks.bank_id AND
                    clients.first_name_id = first_names.first_name_id
            `,
            values: [
                billID,
                clientID
            ]
        };
    
        const result = await pool.query<IBill>(query);

        return result.rows[0];
    }

    public static async Select(clientID: number): Promise<IBaseBill[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    bills.bill_id AS id,
                    bills.bill_number AS "billNumber",
                    banks.name AS "bankName",
                    bills.expires AS "expireDate",
                    first_names.first_name AS "ownerName"
                FROM
                    bills,
                    banks,
                    clients,
                    first_names,
                    bills_clients
                WHERE
                    clients.client_id = $1 AND
                    bills.bank_id = banks.bank_id AND
                    bills_clients.clients_client_id = $1 AND
                    bills_clients.bills_bill_id = bills.bill_id AND
                    clients.first_name_id = first_names.first_name_id
            `,
            values: [
                clientID
            ]
        };
    
        const result = await pool.query<IBaseBill>(query);
    
        return result.rows;
    }

    public static async SelectBillsNumbers(clientID: number): Promise<IBillNumber[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    bills.bill_id AS id,
                    bills.bill_number AS "billNumber"
                FROM
                    bills,
                    clients,
                    bills_clients
                WHERE
                    clients.client_id = $1 AND
                    bills_clients.clients_client_id = $1 AND
                    bills_clients.bills_bill_id = bills.bill_id
            `,
            values: [
                clientID
            ]
        };
    
        const result = await pool.query<IBillNumber>(query);
    
        return result.rows;
    }

    public static async Insert(bill: IBill, clientID?: number): Promise<ID> {
        const billID = await super.Insert(bill);
        
        const query: QueryConfig = {
            text: `
                INSERT INTO
                    bills_clients (
                        bills_bill_id,
                        clients_client_id
                    )
                VALUES
                    ($1, $2)
            `,
            values: [
                billID.id,
                clientID
            ]
        };
    
        await pool.query(query);

        return billID;
    }

    public static async Delete(billID: number): Promise<void> {
        await super.Delete(billID);

        const query: QueryConfig = {
            text: `
                DELETE FROM
                    bills_clients
                WHERE
                    bills_bill_id = $1
            `,
            values: [
                billID
            ]
        };
    
        await pool.query(query);
    }
}

export default BillsClients;