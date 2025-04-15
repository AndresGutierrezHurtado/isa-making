"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Carts", {
            user_id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            product_id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            size_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            product_quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Carts");
    },
};
