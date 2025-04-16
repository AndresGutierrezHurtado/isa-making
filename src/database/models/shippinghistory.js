"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ShippingHistory extends Model {}
    ShippingHistory.init(
        {
            history_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            shipping_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            shipping_state: {
                type: DataTypes.ENUM("pending", "ready", "recoding", "shipping", "delivered"),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "ShippingHistory",
            timestamps: true,
        }
    );
    return ShippingHistory;
};
