import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

//Konfigurasi Model Tags
const Tags = db.define ('tags', {
    tags_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    freezeTableName: true
})

export default Tags;