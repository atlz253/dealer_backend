import { QueryConfig } from "pg";
import pool from "./pool";
import IBaseProvider from "dealer_common/interfaces/IBaseProvider";
import IProvider from "dealer_common/interfaces/IProvider";
import ID from "dealer_common/interfaces/ID";
import DB from "./DB";
import IName from "dealer_common/interfaces/IName";
import BillsProvider from "./BillsProviders";
import ProvidersProducts from "./ProvidersProducts";
import ICount from "dealer_common/interfaces/ICount";

class Providers {
    public static get Bills(): typeof BillsProvider {
        return BillsProvider;
    }

    public static get Products(): typeof ProvidersProducts {
        return ProvidersProducts;
    }

    public static async SelectAll(): Promise<IBaseProvider[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    providers.provider_id AS id,
                    company_names.company_name AS name,
                    providers.added
                FROM
                    providers,
                    company_names
                WHERE
                    providers.company_name_id = company_names.company_name_id
            `
        };
    
        const result = await pool.query<IBaseProvider>(query);
    
        return result.rows;
    }

    public static async SelectNames(): Promise<IName[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    providers.provider_id AS id,
                    company_names.company_name AS name
                FROM
                    providers,
                    company_names
                WHERE
                    providers.company_name_id = company_names.company_name_id
            `
        };
    
        const result = await pool.query<IName>(query);
    
        return result.rows;
    }

    public static async Select(id: number): Promise<IProvider> {
        const query: QueryConfig = {
            text: `
                SELECT
                    providers.provider_id AS id,
                    company_names.company_name AS name,
                    providers.added,
                    providers.phone,
                    providers.address
                FROM
                    providers,
                    company_names
                WHERE
                    providers.provider_id = $1 AND
                    providers.company_name_id = company_names.company_name_id
            `,
            values: [
                id
            ]
        };
    
        const result = await pool.query<IProvider>(query);
    
        return result.rows[0];
    }

    public static async SelectCount(): Promise<ICount> {
        const query: QueryConfig = {
            text: `
                SELECT
                    COUNT(*)
                FROM
                    providers
            `
        };
    
        const result = await pool.query<ICount>(query);
    
        return result.rows[0];
    }

    public static async Insert(provider: IProvider): Promise<ID> {
        const companyNameID = await DB.CompanyNames.SelectIDByName(provider.name);

        const query: QueryConfig = {
            text: `
                INSERT INTO
                    providers (
                        company_name_id,
                        phone,
                        address,
                        added
                    )
                VALUES
                    ($1, $2, $3, NOW())
                RETURNING
                    provider_id AS id
            `,
            values: [
                companyNameID.id,
                provider.phone,
                provider.address
            ]
        };
    
        const result = await pool.query<ID>(query);
    
        return result.rows[0];
    }

    public static async Update(provider: IProvider): Promise<void> {
        const companyNameID = await DB.CompanyNames.SelectIDByName(provider.name);

        const query: QueryConfig = {
            text: `
                UPDATE
                    providers
                SET
                    company_name_id = $1,
                    phone = $2,
                    address = $3
                WHERE
                    provider_id = $4
            `,
            values: [
                companyNameID,
                provider.phone,
                provider.address,
                provider.id
            ]
        };
    
        await pool.query(query);
    }

    public static async Delete(id: number): Promise<void> {
        const query: QueryConfig = {
            text: `
                DELETE FROM
                    providers
                WHERE
                    provider_id = $1
            `,
            values: [
                id
            ]
        };
    
        await pool.query(query);
    }
}

export default Providers;