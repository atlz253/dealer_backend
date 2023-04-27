import IBaseBill from "audio_diler_common/interfaces/IBaseBill";
import { QueryConfig } from "pg";
import pool from "./pool";
import IBill from "audio_diler_common/interfaces/IBill";
import ID from "audio_diler_common/interfaces/ID";
import DB from "./DB";
import BillOwners from "./BillOwners";
import Logger from "../logger";

interface IQueryBaseBill extends IBaseBill {
    ownerID?: number
}

interface IQueryBill extends IBill {
    ownerID?: number
}

class Bills {
    public static get Owners(): typeof BillOwners {
        return BillOwners;
    }

    // public static async SelectByID(id: number): Promise<IBaseBill[]> {
    //     const query: QueryConfig = {
    //         text: `
    //             SELECT
    //                 bills.bill_id AS id,
    //                 bills.bill_number as "billNumber",
    //                 banks.name as "bankName",
    //                 bills.expires as "expireDate",
    //                 bills.bill_owner_id as "ownerID"
    //             FROM
    //                 bills,
    //                 banks
    //             WHERE
    //                 bills.bank_id = banks.bank_id
    //         `
    //     }

    //     const result = await pool.query<IQueryBaseBill>(query);

    //     const bills: IBaseBill[] = []; 
        
    //     for (let i = 0; i < result.rowCount; i++) {
    //         const bill = result.rows[i];
            
    //         if (bill.ownerID === undefined) {
    //             Logger.error(`ID владельца не определен для ${bill.id}`)

    //             continue;
    //         } 

    //         const billOwner = await this.Owners.Select(bill.ownerID);

    //         if (billOwner.dealerID !== id) {
    //             continue;
    //         }

    //         bill.ownerName = await DB.Users.SelectNameByID(id);

    //         delete bill.ownerID

    //         bills.push(bill);
    //     }

    //     return bills;
    // }

    // public static async Select(id: number): Promise<IBill> {
    //     const query: QueryConfig = {
    //         text: `
    //         SELECT
    //             bills.bill_id AS id,
    //             bills.bill_number as "billNumber",
    //             banks.name as "bankName",
    //             bills.expires as "expireDate",
    //             bills.bill_owner_id as "ownerID",
    //             bills.correspondent_bill as "correspondentBill",
    //             bills.bic as "BIC",
    //             bills.inn as "INN"
    //         FROM
    //             bills,
    //             banks
    //         WHERE
    //             bill_id = $1 AND
    //             bills.bank_id = banks.bank_id
    //         `,
    //         values: [id]
    //     };

    //     const result = await pool.query<IQueryBill>(query);

    //     const bill = result.rows[0];

    //     if (bill.ownerID === undefined) {
    //         throw Error(`ID владельца не определен для ${bill.id}`);
    //     }

    //     bill.ownerName = await this.Owners.SelectOwnerNameByID(bill.ownerID);

    //     delete bill.ownerID;

    //     return bill;
    // }

    public static async Insert(bill: IBill, owner_type: string, owner_id: number): Promise<ID> {
        const bankID = await DB.Banks.GetIDByName(bill.bankName);
        const ownerID = await DB.Bills.Owners.SelectOwnerIDByDealerID(owner_id); // TODO: ownerID в зависимости от типа пользователя
        const expiresDate = new Date(bill.expireDate).toLocaleDateString();

        const query: QueryConfig = {
            text: `
                INSERT INTO
                    bills (
                        bill_number,
                        bank_id,
                        correspondent_bill,
                        bic,
                        inn,
                        bill_owner_id,
                        expires
                    )
                VALUES
                    ($1, $2, $3, $4, $5, $6, $7)
                RETURNING 
                    bill_id AS id
            `,
            values: [
                bill.billNumber, 
                bankID, 
                bill.correspondentBill, 
                bill.BIC, 
                bill.INN,
                ownerID,
                expiresDate                
            ]
        }

        const result = await pool.query<ID>(query);

        return result.rows[0];
    }

    public static async Update(bill: IBill): Promise<void> { // FIXME: обновление уникальных значений вызывает ошибку
        const bankID = await DB.Banks.GetIDByName(bill.bankName);
        const expiresDate = new Date(bill.expireDate).toLocaleDateString();

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
                expiresDate,
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
            values: [id]
        }

        await pool.query(query);
    }
}

export default Bills;