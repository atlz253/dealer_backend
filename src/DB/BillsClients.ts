import { QueryConfig } from "pg";
import pool from "./pool";

class BillsClients {
    public static async Insert(clientID: number, billID: number): Promise<void> {
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
                billID,
                clientID
            ]
        };
    
        await pool.query(query);
    }

    public static async Delete(clientID: number): Promise<void> {
        const query: QueryConfig = {
            text: `
                DELETE FROM
                    bills_clients
                WHERE
                    clients_client_id = $1
            `,
            values: [
                clientID
            ]
        };
    
        await pool.query(query);
    }
}

export default BillsClients;