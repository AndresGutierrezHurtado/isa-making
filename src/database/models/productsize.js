"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ProductSize extends Model {}
    ProductSize.init(
        {
            product_id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            size_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            product_price: {
                type: DataTypes.DECIMAL(10, 0),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "ProductSize",
            timestamps: false,
        }
    );
    return ProductSize;
};
