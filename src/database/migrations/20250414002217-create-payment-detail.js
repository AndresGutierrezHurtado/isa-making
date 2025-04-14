"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("PaymentDetails", {
            payment_id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            order_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            payu_reference: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            payment_method: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            payment_amount: {
                type: Sequelize.DECIMAL(10, 0),
                allowNull: false,
            },
            buyer_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            buyer_email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            buyer_document_type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            buyer_document_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            buyer_phone: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                onUpdate: Sequelize.NOW,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("PaymentDetails");
    },
};
