import Admins from "./Admins";
import Authorizations from "./Authorizations";
import Banks from "./Banks";
import Bills from "./Bills";
import Categories from "./Categories";
import Cheques from "./Cheques";
import Clients from "./Clients";
import CompanyNames from "./CompanyNames";
import Contracts from "./Contracts";
import Dealers from "./Dealers";
import FirstNames from "./FirstNames";
import Manufacturers from "./Manufacturers";
import Products from "./Products";
import Providers from "./Providers";

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

    public static get Providers(): typeof Providers {
        return Providers;
    }

    public static get CompanyNames(): typeof CompanyNames {
        return CompanyNames;
    }

    public static get Cheques(): typeof Cheques {
        return Cheques;
    }
}

export default DB;