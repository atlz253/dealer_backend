import IBaseProduct from "dealer_common/interfaces/IBaseProduct";
import createBufferDocument from "./createBufferDocument";

const createProductsBufferDocument = (products: IBaseProduct[]): any => {
    const rows: [[string, string, string, string] | [string, string, number, number]] = [
        ["Наименование товара", "Категория", "Количество", "Стоимость"]
    ];

    products.forEach(product => rows.push([product.name, product.category, product.quantity, product.price]));

    return createBufferDocument(rows);
}

export default createProductsBufferDocument;