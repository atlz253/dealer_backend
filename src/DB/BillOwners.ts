import { QueryConfig } from "pg";
import pool from "./pool";
import ID from "audio_diler_common/interfaces/ID";
import IBillOwner from "../interfaces/IBillOwner";
import DB from "./DB";
import Logger from "../logger";

class BillOwners {
    private static async InserDealerID(id: number): Promise<number> { // TODO: Вставлять в остальные ID NULL
        const query: QueryConfig = {
            text: `
                INSERT INTO
                    bill_owners (
                        dealer_id
                    )
                VALUES
                    ($1)
                RETURNING
                    bill_owner_id AS id
            `,
            values: [id]
        }

        const result = await pool.query<ID>(query);

        return result.rows[0].id;
    }

    public static async SelectOwnerIDByDealerID(id: number): Promise<number> {
        const query: QueryConfig = {
            text: `
                SELECT
                    bill_owner_id AS id
                FROM
                    bill_owners
                WHERE
                    dealer_id = $1
            `,
            values: [id]
        };

        const result = await pool.query<ID>(query);

        if (result.rowCount === 0) {
            return await this.InserDealerID(id);
        }

        return result.rows[0].id;
    }

    public static async Select(id: number): Promise<IBillOwner> {
        const query: QueryConfig = {
            text: `
                SELECT
                    dealer_id as "dealerID",
                    client_id as "clientID",
                    provider_id as "providerID"
                FROM
                    bill_owners
                WHERE
                    bill_owner_id = $1
            `,
            values: [id]
        }

        const result = await pool.query<IBillOwner>(query);

        return result.rows[0];
    }

    public static async SelectOwnerNameByID(id: number): Promise<string> {
        const owner = await this.Select(id);

        if (owner.dealerID !== null) {
            return await DB.Users.SelectNameByID(owner.dealerID);
        }
        else if (owner.clientID !== null) {
            return "";
        }
        else if (owner.providerID !== null) {
            return "";
        }
        else {
            throw Error("Не удалось определить тип владельца счета");
        }
    }
}

export default BillOwners;