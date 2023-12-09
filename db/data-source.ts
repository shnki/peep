import { DataSourceOptions, DataSource } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {

    type: "postgres",
    host: "0.0.0.0",
    port: 5432,
    username: "postgres",
    password: "mysecretpassword",
    database: "HussinDB",
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/**/*.migration{.ts,.js}'],
    synchronize: true
}

export default new DataSource(dataSourceOptions);

