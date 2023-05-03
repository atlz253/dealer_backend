import { QueryConfig } from "pg";
import pool from "./pool";
import Bills from "./Bills";
import ID from "audio_diler_common/interfaces/ID";
import IBill from "audio_diler_common/interfaces/IBill";
import IBaseBill from "audio_diler_common/interfaces/IBaseBill";
import IBillNumber from "audio_diler_common/interfaces/IBillNumber";

// TODO: Удаление и вставку счетов можно переписать в 1 SQL запрос
class BillsProvider extends Bills {
    public static async Select(billID: number, providerID: number): Promise<IBill> {
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
                    company_names.company_name AS "ownerName"
                FROM
                    bills,
                    banks,
                    providers,
                    company_names
                WHERE
                    bills.bill_id = $1 AND
                    providers.provider_id = $2 AND
                    bills.bank_id = banks.bank_id AND
                    providers.company_name_id = company_names.company_name_id
            `,
            values: [
                billID,
                providerID
            ]
        };
    
        const result = await pool.query<IBill>(query);

        return result.rows[0];
    }

    public static async SelectAll(providerID: number): Promise<IBaseBill[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    bills.bill_id AS id,
                    bills.bill_number AS "billNumber",
                    banks.name AS "bankName",
                    bills.expires AS "expireDate",
                    company_names.company_name AS "ownerName"
                FROM
                    bills,
                    banks,
                    providers,
                    company_names,
                    bills_providers
                WHERE
                    providers.provider_id = $1 AND
                    bills.bank_id = banks.bank_id AND
                    bills_providers.providers_provider_id = $1 AND
                    bills_providers.bills_bill_id = bills.bill_id AND
                    providers.company_name_id = company_names.company_name_id
            `,
            values: [
                providerID
            ]
        };
    
        const result = await pool.query<IBaseBill>(query);
    
        return result.rows;
    }

    public static async SelectBillsNumbers(providerID: number): Promise<IBillNumber[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    bills.bill_id AS id,
                    bills.bill_number AS "billNumber"
                FROM
                    bills,
                    providers,
                    bills_providers
                WHERE
                    providers.provider_id = $1 AND
                    bills_providers.providers_provider_id = $1 AND
                    bills_providers.bills_bill_id = bills.bill_id
            `,
            values: [
                providerID
            ]
        };
    
        const result = await pool.query<IBillNumber>(query);
    
        return result.rows;
    }

    public static async Insert(bill: IBill, providerID?: number): Promise<ID> {
        const billID = await super.Insert(bill);

        const query: QueryConfig = {
            text: `
                INSERT INTO
                    bills_providers (
                        bills_bill_id,
                        providers_provider_id
                    )
                VALUES
                    ($1, $2)
            `,
            values: [
                billID.id,
                providerID
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
                    bills_providers
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

export default BillsProvider;