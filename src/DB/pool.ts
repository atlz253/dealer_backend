import { Pool } from "pg";
import { DBConf } from "../config";

const pool = new Pool({
    connectionString: `postgresql://${DBConf.user}:${DBConf.password}@${DBConf.host}:${DBConf.port}/${DBConf.database}`,
    ssl: false
});

export default pool; 