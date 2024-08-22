import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

//Konfigurasi Model Chapter
const Chapter = db.define('chapter', {
    chapter_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    story_chapter: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});


export default Chapter;
