"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {}
    Cart.init(
        {
            user_id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            product_id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            size_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            product_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
        },
        {
            sequelize,
            modelName: "Cart",
            timestamps: false,
        }
    );
    return Cart;
};
