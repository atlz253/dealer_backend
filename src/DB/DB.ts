import Banks from "./Banks";
import Bills from "./Bills";
import Categories from "./Categories";
import Clients from "./Clients";
import Manufacturers from "./Manufacturers";
import Products from "./Products";
import Users from "./Users";

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

    public static get Users(): typeof Users {
        return Users;
    }

    public static get Bills(): typeof Bills {
        return Bills;
    }

    public static get Banks(): typeof Banks {
        return Banks;
    }

    public static get Clients(): typeof Clients {
        return Clients;
    }
}

export default DB;