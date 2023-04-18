import Categories from "./Categories";
import Manufacturers from "./Manufacturers";
import Products from "./Products";

class DB {
    public static get Categories(): typeof Categories {
        return Categories;
    }

    public static get Products(): typeof Products {
        return Products;
    }

    public static get Manufacturers(): typeof Manufacturers {
        return Manufacturers;
    }
}

export default DB;