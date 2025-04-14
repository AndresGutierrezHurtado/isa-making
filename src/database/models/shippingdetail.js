"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ShippingDetail extends Model {}
    ShippingDetail.init(
        {
            shipping_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            order_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            shipping_guide: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            shipping_courier: {
                type: DataTypes.ENUM("interrapidisimo", "fedex"),
                allowNull: false,
            },
            tracking_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            shipping_estimated: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "ShippingDetail",
            timestamps: true,
        }
    );
    return ShippingDetail;
};
