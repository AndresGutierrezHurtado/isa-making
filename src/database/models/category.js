"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {}
    Category.init(
        {
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            category_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            category_image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            category_slug: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Category",
            timestamps: false,
        }
    );
    return Category;
};
