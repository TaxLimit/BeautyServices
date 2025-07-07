import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgres", "postgres", "Odilija654", {
  host: "localhost",
  port: 3000,
  dialect:
    "postgres" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
  logging: console.log,
});

export default sequelize;
