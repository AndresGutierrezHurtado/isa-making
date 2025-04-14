"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("ProductCategories", {
            product_id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            category_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("ProductCategories");
    },
};
