"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {}
    Product.init(
        {
            product_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            product_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            product_description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            product_image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            product_color: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            product_stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Product",
            timestamps: true,
            paranoid: true,
        }
    );
    return Product;
};
