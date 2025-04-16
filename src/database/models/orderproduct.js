"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class OrderProduct extends Model {}
    OrderProduct.init(
        {
            order_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            product_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
            size_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            product_price: {
                type: DataTypes.DECIMAL(10, 0),
                allowNull: false,
            },
            product_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "OrderProduct",
            timestamps: false,
        }
    );
    return OrderProduct;
};
