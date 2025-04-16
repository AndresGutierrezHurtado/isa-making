"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ShippingDetails", {
            shipping_id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            order_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            shipping_guide: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            shipping_courier: {
                type: Sequelize.ENUM("interrapidisimo", "fedex"),
                allowNull: false,
            },
            tracking_url: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            shipping_estimated: {
                type: Sequelize.DATE,
                allowNull: true,
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
        await queryInterface.dropTable("ShippingDetails");
    },
};
