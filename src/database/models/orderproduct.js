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
            product_size: {
                type: DataTypes.STRING,
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
