"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ProductSizes", {
            product_id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            size_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            product_price: {
                type: Sequelize.DECIMAL(10, 0),
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("ProductSizes");
    },
};
