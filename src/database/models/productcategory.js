"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ProductCategory extends Model {}
    ProductCategory.init(
        {
            product_id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            category_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
        },
        {
            sequelize,
            modelName: "ProductCategory",
            timestamps: false,
        }
    );
    return ProductCategory;
};
