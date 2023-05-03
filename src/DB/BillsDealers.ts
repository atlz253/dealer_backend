import { QueryConfig } from "pg";
import pool from "./pool";
import IBaseBill from "audio_diler_common/interfaces/IBaseBill";
import IBillNumber from "audio_diler_common/interfaces/IBillNumber";
import IBill from "audio_diler_common/interfaces/IBill";
import Bills from "./Bills";
import ID from "audio_diler_common/interfaces/ID";

class BillsDealers extends Bills {
    public static async SelectAll(dealerID: number): Promise<IBaseBill[]> {
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

    public static async SelectBillsNumbers(dealerID: number): Promise<IBillNumber[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    bills.bill_id AS id,
                    bills.bill_number AS "billNumber"
                FROM
                    bills,
                    dealers,
                    bills_dealers
                WHERE
                    dealers.dealer_id = $1 AND
                    bills_dealers.dealers_dealer_id = $1 AND
                    bills_dealers.bills_bill_id = bills.bill_id
            `,
            values: [
                dealerID
            ]
        };
    
        const result = await pool.query<IBillNumber>(query);
    
        return result.rows;
    }

    public static async Select(billID: number, dealerID: number): Promise<IBill> {
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

    public static async Insert(bill: IBill, dealerID?: number): Promise<ID> {
        const billID = await super.Insert(bill);
        
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
                billID.id,
                dealerID
            ]
        };
    
        await pool.query(query);

        return billID;
    }

    public static async Delete(billID: number): Promise<void> { // FIXME: в теории дилер может удалить счет другого дилера
        await super.Delete(billID);
        
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