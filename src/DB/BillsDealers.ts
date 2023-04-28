import { QueryConfig } from "pg";
import pool from "./pool";

class BillsDealers {
    public static async Insert(dealerID: number, billID: number): Promise<void> {
        const query: QueryConfig = {
            text: `
                INSERT INTO
                    bills_dealers (
                        bills_bill_id,
                        dealers_dealer_id
                    )
                VALUES
                    ($1, $2)
            `,
            values: [
                billID,
                dealerID
            ]
        };
    
        await pool.query(query);
    }

    public static async Delete(billID: number): Promise<void> {
        const query: QueryConfig = {
            text: `
                DELETE FROM
                    bills_dealers
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

export default BillsDealers;