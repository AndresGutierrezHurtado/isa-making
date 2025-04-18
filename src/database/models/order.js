"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {}
    Order.init(
        {
            order_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            order_state: {
                type: DataTypes.ENUM("pending", "completed"),
                defaultValue: "pending",
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Order",
            timestamps: true,
        }
    );
    return Order;
};
