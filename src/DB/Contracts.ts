import { QueryConfig } from "pg";
import pool from "./pool";
import IBaseContract from "audio_diler_common/interfaces/IBaseContract";
import IContract from "audio_diler_common/interfaces/IContract";
import ID from "audio_diler_common/interfaces/ID";
import ContractsProducts from "./ContractsProducts";
import DBMoneyConverter from "../utils/DBMoneyConverter";
import INewContract from "audio_diler_common/interfaces/INewContract";

class Contracts {
    public static get Products(): typeof ContractsProducts {
        return ContractsProducts;
    }

    public static async Select(): Promise<IBaseContract[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    contracts.contract_id AS id,
                    (
                        SELECT
                            first_names.first_name as "sellerName"
                        FROM
                            dealers,
                            first_names,
                            bills_dealers
                        WHERE
                            bills_dealers.bills_bill_id = contracts.seller_bill_id AND
                            bills_dealers.dealers_dealer_id = dealers.dealer_id AND
                            first_names.first_name_id = dealers.first_name_id
                    ),
                    (
                        SELECT
                            first_names.first_name as "buyerName"
                        FROM
                            clients,
                            first_names,
                            bills_clients
                        WHERE
                            bills_clients.bills_bill_id = contracts.buyer_bill_id AND
                            bills_clients.clients_client_id = clients.client_id AND
                            first_names.first_name_id = clients.first_name_id
                    ),
                    (
                        SELECT
                            SUM(products.price) AS price
                        FROM
                            products,
                            contracts_products
                        WHERE
                            contracts_products.contracts_contract_id = contracts.contract_id AND
                            contracts_products.products_product_id = products.product_id
                    ),
                    contracts.created
                FROM
                    contracts
            `
        };
    
        const result = await pool.query<IBaseContract>(query);
    
        for (let i = 0; i < result.rows.length; i++) {
            const contract = result.rows[i];
            
            contract.price = DBMoneyConverter.ConvertMoneyToNumber(contract.price);
        }

        return result.rows;
    }

    public static async SelectByID(id: number): Promise<IContract> {
        const query: QueryConfig = {
            text: `
                SELECT
                    contracts.contract_id AS id,
                    contracts.created,
                    (
                        SELECT
                            json_build_object(
                                'id', bills.bill_id,
                                'billNumber', bills.bill_number,
                                'bankName', banks.name,
                                'expireDate', bills.expires,
                                'correspondentBill', bills.correspondent_bill,
                                'BIC', bills.bic,
                                'INN', bills.inn,
                                'ownerName', first_names.first_name 
                            )
                        FROM
                            bills,
                            banks,
                            dealers,
                            first_names,
                            bills_dealers
                        WHERE
                            bills.bill_id = contracts.seller_bill_id AND
                            bills.bill_id = bills_dealers.bills_bill_id AND
                            dealers.dealer_id = bills_dealers.dealers_dealer_id AND
                            bills.bank_id = banks.bank_id AND
                            dealers.first_name_id = first_names.first_name_id
                    ) AS "sellerBill",
                    (
                        SELECT
                            json_build_object(
                                'id', bills.bill_id,
                                'billNumber', bills.bill_number,
                                'bankName', banks.name,
                                'expireDate', bills.expires,
                                'correspondentBill', bills.correspondent_bill,
                                'BIC', bills.bic,
                                'INN', bills.inn,
                                'ownerName', first_names.first_name 
                            )
                        FROM
                            bills,
                            banks,
                            clients,
                            first_names,
                            bills_clients
                        WHERE
                            bills.bill_id = contracts.buyer_bill_id AND
                            bills.bill_id = bills_clients.bills_bill_id AND
                            clients.client_id = bills_clients.clients_client_id AND
                            bills.bank_id = banks.bank_id AND
                            clients.first_name_id = first_names.first_name_id
                    ) AS "buyerBill",
                    ARRAY(
                        SELECT
                            json_build_object(
                                'id', products.product_id,
                                'name', products.name,
                                'category', categories.name,
                                'price', products.price,
                                'quantity', products.quantity
                            )
                        FROM
                            products,
                            categories,
                            contracts_products
                        WHERE
                            contracts_products.contracts_contract_id = $1 AND
                            products.category_id = categories.category_id AND
                            contracts_products.products_product_id = products.product_id
                    ) AS products,
                    (
                        SELECT
                            SUM(products.price) AS price
                        FROM
                            products,
                            contracts_products
                        WHERE
                            contracts_products.contracts_contract_id = contracts.contract_id AND
                            contracts_products.products_product_id = products.product_id
                    )
                FROM
                    contracts
                WHERE
                    contracts.contract_id = $1
            `,
            values: [
                id
            ]
        };
    
        const result = await pool.query<IContract>(query);
    
        const contract = result.rows[0];

        contract.price = DBMoneyConverter.ConvertMoneyToNumber(contract.price);

        for (let i = 0; i < contract.products.length; i++) {
            const product = contract.products[i];
            
            product.price = DBMoneyConverter.ConvertMoneyToNumber(product.price);
        }

        return result.rows[0];
    }

    public static async Insert(contract: INewContract): Promise<ID> {
        const query: QueryConfig = {
            text: `
                INSERT INTO
                    contracts (
                        created,
                        seller_bill_id,
                        buyer_bill_id
                    )
                VALUES
                    (
                        NOW(),
                        $1,
                        $2
                    )
                RETURNING
                    contract_id AS id
            `,
            values: [
                contract.sellerBillID,
                contract.buyerBillID
            ]
        };
    
        const result = await pool.query<ID>(query);

        const contractID = result.rows[0];
        const productIDs = contract.products.map(product => product.id);

        await this.Products.Insert(contractID.id, productIDs);

        return contractID;
    }
}

export default Contracts;