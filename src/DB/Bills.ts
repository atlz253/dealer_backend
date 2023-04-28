import IBaseBill from "audio_diler_common/interfaces/IBaseBill";
import { QueryConfig } from "pg";
import pool from "./pool";
import IBill from "audio_diler_common/interfaces/IBill";
import ID from "audio_diler_common/interfaces/ID";
import DB from "./DB";
import Logger from "../logger";
import BillsDealers from "./BillsDealers";

class Bills {
    public static get BillsDealers(): typeof BillsDealers {
        return BillsDealers;
    }

    public static async SelectDealerBill(billID: number, dealerID: number): Promise<IBill> {
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
                    dealers,
                    first_names
                WHERE
                    bills.bill_id = $1 AND
                    dealers.dealer_id = $2 AND
                    bills.bank_id = banks.bank_id AND
                    dealers.first_name_id = first_names.first_name_id
            `,
            values: [
                billID,
                dealerID
            ]
        };
    
        const result = await pool.query<IBill>(query);
    
        return result.rows[0];
    }

    public static async SelectByDealerID(dealerID: number): Promise<IBaseBill[]> {
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
                    dealers,
                    first_names,
                    bills_dealers
                WHERE
                    dealers.dealer_id = $1 AND
                    bills.bank_id = banks.bank_id AND
                    bills_dealers.dealers_dealer_id = $1 AND
                    bills_dealers.bills_bill_id = bills.bill_id AND
                    dealers.first_name_id = first_names.first_name_id
            `,
            values: [
                dealerID
            ]
        };
    
        const result = await pool.query<IBaseBill>(query);
    
        return result.rows;
    }

    public static async Insert(bill: IBill): Promise<ID> {
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

    public static async Delete(id: number): Promise<void> {
        const query: QueryConfig = {
            text: `
                DELETE FROM
                    bills
                WHERE
                    bill_id = $1
            `,
            values: [
                id
            ]
        };
    
        await pool.query(query);
    }
}

export default Bills;