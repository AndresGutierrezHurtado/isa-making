"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PaymentDetail extends Model {}
    PaymentDetail.init(
        {
            payment_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            order_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            payu_reference: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            payment_method: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            payment_amount: {
                type: DataTypes.DECIMAL(10, 0),
                allowNull: false,
            },
            buyer_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            buyer_email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            buyer_document_type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            buyer_document_number: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "PaymentDetail",
            timestamps: true,
        }
    );
    return PaymentDetail;
};
