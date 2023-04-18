import { Pool } from "pg";
import { DB } from "./config";

const pool = new Pool({
    connectionString: `postgresql://${DB.user}:${DB.password}@${DB.host}:${DB.port}/${DB.database}`,
    ssl: false
});

export default pool; 