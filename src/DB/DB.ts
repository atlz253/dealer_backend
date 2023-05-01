import Admins from "./Admins";
import Authorizations from "./Authorizations";
import Banks from "./Banks";
import Bills from "./Bills";
import Categories from "./Categories";
import Clients from "./Clients";
import Contracts from "./Contracts";
import Dealers from "./Dealers";
import FirstNames from "./FirstNames";
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

    public static get Bills(): typeof Bills {
        return Bills;
    }

    public static get Banks(): typeof Banks {
        return Banks;
    }

    public static get Clients(): typeof Clients {
        return Clients;
    }

    public static get Admins(): typeof Admins {
        return Admins;
    }

    public static get Autorizations(): typeof Authorizations {
        return Authorizations;
    }

    public static get FirstNames(): typeof FirstNames {
        return FirstNames;
    }

    public static get Dealers(): typeof Dealers {
        return Dealers;
    }

    public static get Contracts(): typeof Contracts {
        return Contracts;
    }
}

export default DB;