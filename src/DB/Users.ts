import { QueryConfig } from "pg";
import pool from "./pool";
import IBaseUser from "audio_diler_common/interfaces/IBaseUser";
import UserTypes from "./UserTypes";
import IUser from "audio_diler_common/interfaces/IUser";
import ID from "audio_diler_common/interfaces/ID";
import ILoginData from "audio_diler_common/interfaces/ILoginData";
import IUserAuthInfo from "../interfaces/IUserAuthInfo";
import Logger from "../logger";

class Users {
    public static get Types(): typeof UserTypes {
        return UserTypes;
    }

    public static async SelectAll(): Promise<IBaseUser[]> {
        const query: QueryConfig = {
            text: `
                SELECT
                    users.name,
                    users.login,
                    users.user_id as id,
                    user_types.name as type,
                    users.employment_date as "employmentDate"
                FROM
                    users,
                    user_types
                WHERE
                    users.user_type_id = user_types.user_type_id
            `
        }

        const result = await pool.query<IBaseUser>(query);

        return result.rows;
    }

    public static async SelectByID(id: number): Promise<IUser | null> {
        const query: QueryConfig = {
            text: `
                SELECT
                    users.name,
                    users.login,
                    users.password,
                    users.user_id as id,
                    user_types.name as type,
                    users.employment_date as "employmentDate",
                    users.birthday
                FROM
                    users,
                    user_types
                WHERE
                    users.user_id = $1 AND
                    users.user_type_id = user_types.user_type_id 
            `,
            values: [id]
        }

        const result = await pool.query<IUser>(query);

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    }

    public static async SelectByLoginData(data: ILoginData): Promise<IUserAuthInfo | null> {
        const query: QueryConfig = {
            text: `
                SELECT
                    user_types.name as type
                FROM
                    users,
                    user_types
                WHERE
                    users.login = $1 AND
                    users.password = $2 AND
                    users.user_type_id = user_types.user_type_id
            `,
            values: [
                data.login,
                data.password
            ]
        }

        const result = await pool.query<{ type: string }>(query);

        if (result.rowCount === 0) {
            return null;
        }

        return {
            type: result.rows[0].type,
            login: data.login
        };
    }

    public static async SelectIDByLogin(login: string): Promise<number> {
        const query: QueryConfig = {
            text: `
                SELECT
                    user_id AS id
                FROM
                    users
                WHERE
                    login = $1
            `,
            values: [login]
        };

        const result = await pool.query<ID>(query);

        return result.rows[0].id;
    }

    public static async SelectNameByID(id: number): Promise<string> {
        const query: QueryConfig = {
            text: `
                SELECT
                    name
                FROM
                    users
                WHERE
                    user_id = $1
            `,
            values: [id]
        };

        const result = await pool.query<{ name: string }>(query);

        return result.rows[0].name;
    }

    public static async Insert(user: IUser): Promise<ID> {
        const typeID = await this.Types.GetIDNyName(user.type);

        const employmentDate = new Date(user.employmentDate).toLocaleDateString()
        const birthday = (user.birthday === null) ? null : new Date(user.birthday).toLocaleDateString();

        const query: QueryConfig = {
            text: `
                INSERT INTO
                    users (
                        name,
                        employment_date,
                        login,
                        password,
                        birthday,
                        user_type_id
                    )
                VALUES
                    ($1, $2, $3, $4, $5, $6) 
                RETURNING 
                    user_id as id
            `,
            values: [
                user.name,
                employmentDate,
                user.login,
                user.password,
                birthday,
                typeID
            ]
        };

        const result = await pool.query<ID>(query);

        return result.rows[0];
    }

    public static async Update(user: IUser): Promise<void> {

        const typeID = await this.Types.GetIDNyName(user.type);

        const employmentDate = new Date(user.employmentDate).toLocaleDateString()
        const birthday = (user.birthday === null) ? null : new Date(user.birthday).toLocaleDateString();

        const query: QueryConfig = {
            text: `
                UPDATE
                    users
                SET
                    name = $1,
                    employment_date = $2,
                    login = $3,
                    password = $4,
                    birthday = $5,
                    user_type_id = $6
                WHERE
                    user_id = $7
            `,
            values: [
                user.name,
                employmentDate,
                user.login,
                user.password,
                birthday,
                typeID,
                user.id
            ]
        }

        await pool.query(query);
    }

    public static async Delete(id: number): Promise<void> {
        if (id === 1) {
            throw Error("Аккаунт первого администратора удалять запрещено");
        }

        const query: QueryConfig = {
            text: `
                DELETE FROM
                    users
                WHERE
                    user_id = $1
            `,
            values: [id]
        }

        await pool.query(query);
    }
}

export default Users;