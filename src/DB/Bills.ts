import IBaseBill from "dealer_common/interfaces/IBaseBill";
import { QueryConfig } from "pg";
import pool from "./pool";
import IBill from "dealer_common/interfaces/IBill";
import ID from "dealer_common/interfaces/ID";
import DB from "./DB";
import Logger from "../logger";
import BillsDealers from "./BillsDealers";
import BillsClients from "./BillsClients";
import IBillNumber from "dealer_common/interfaces/IBillNumber";

class Bills {
    protected static async Insert(bill: IBill): Promise<ID> {
        const bankID = await DB.Banks.GetIDByName(bill.bankName);

        const query: QueryConfig = {
            text: `
                INSERT INTO
                    bills (
                        bill_number,
                        bank_id,
                        correspondent_bill,
                        bic,
                        inn,
                        expires
                    )
                VALUES
                    ($1, $2, $3, $4, $5, $6)
                RETURNING
                    bill_id AS id
            `,
            values: [
                bill.billNumber,
                bankID,
                bill.correspondentBill,
                bill.BIC,
                bill.INN,
                bill.expireDate
            ]
        };
    
        const result = await pool.query<ID>(query);
    
        return result.rows[0];
    }

    public static async Update(bill: IBill): Promise<void> {
        const bankID = await DB.Banks.GetIDByName(bill.bankName);
        
        const query: QueryConfig = {
            text: `
                UPDATE
                    bills
                SET
                    bill_number = $1,
                    bank_id = $2,
                    correspondent_bill = $3,
                    bic = $4,
                    inn = $5,
                    expires = $6	
                WHERE
                    bill_id = $7
            `,
            values: [
                bill.billNumber,
                bankID,
                bill.correspondentBill,
                bill.BIC,
                bill.INN,
                bill.expireDate,
                bill.id
            ]
        };
    
        await pool.query(query);
    }

    protected static async Delete(billID: number): Promise<void> {
        const query: QueryConfig = {
            text: `
                DELETE FROM
                    bills
                WHERE
                    bill_id = $1
            `,
            values: [
                billID
            ]
        };
    
        await pool.query(query);
    }
}

export default Bills;