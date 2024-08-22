import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Category from './Category.js';
import Tags from './Tags.js';
import Status from './Status.js';

const { DataTypes } = Sequelize;

//Konfigurasi Model Stories
const StoriesList = db.define('storieslist', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    synopsis: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Category, 
            key: 'id'
        },
        allowNull: false
    },
    story_cover: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Tags,
            key: 'id'
        },
        allowNull: false
    },
    status_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Status,
            key: 'id'
        },
        allowNull: false
    }
}, {
    freezeTableName: true
});

// Relasi antara StoriesList dan Category
StoriesList.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(StoriesList, { foreignKey: 'category_id' });

// Relasi antara StoriesList dan Tags
StoriesList.belongsTo(Tags, { foreignKey: 'tags_id' });
Tags.hasMany(StoriesList, { foreignKey: 'tags_id' });

// Relasi antara StoriesList dan Status
StoriesList.belongsTo(Status, { foreignKey: 'status_id' });
Status.hasMany(StoriesList, { foreignKey: 'status_id' });

export default StoriesList;
