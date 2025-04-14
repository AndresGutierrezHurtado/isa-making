"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("OrderProducts", {
            order_id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
            },
            product_id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
            },
            product_size: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            product_price: {
                type: Sequelize.DECIMAL(10, 0),
                allowNull: false,
            },
            product_quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("OrderProducts");
    },
};
