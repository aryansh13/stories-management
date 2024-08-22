import { Sequelize } from "sequelize";

//Konfigurasi Database
const db = new Sequelize("db_stories", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

export default db;