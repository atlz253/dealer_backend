import IQueriesCategory from "dealer_common/interfaces/IQueriesCategory";

const queriesList: IQueriesCategory[] = [
    {
        name: "Товары",
        items: [
            {
                name: "Номенклатура предлагаемой на продажу продукции",
                link: "/queries/products"
            },
            {
                name: "Поставленные и проданные товары",
                link: "/queries/products/processed"
            },
            {
                name: "Товары, находящиеся на складе",
                link: "/queries/products?onlyAvaibleInStock=true"
            },
            {
                name: "Список заказываемых товаров",
                link: "/queries/products?avaibleForOrder=true"
            },
        ]
    },
    {
        name: "Клиенты",
        items: [
            {
                name: "Список клиентов по типу запрашиваемых товаров",
                link: "/queries/clients/requestedCategories"
            },
            {
                name: "Список потенциальных клиентов запрашиваемых товаров",
                link: "/queries/clients/potential"
            }
        ]
    },
    {
        name: "Счета на оплату",
        items: [
            {
                name: "Все счета",
                link: "/queries/cheques"
            },
            {
                name: "Оплаченные счета",
                link: "/queries/cheques?chequeStatus=paid"
            },
            {
                name: "Неоплаченные счета",
                link: "/queries/cheques?chequeStatus=unpaid"
            }
        ]
    },
    {
        name: "Договора",
        items: [
            {
                name: "На поставку и продажу товара",
                link: "/queries/contracts"
            }
        ]
    }
]

export default queriesList;