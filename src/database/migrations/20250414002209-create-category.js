"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Categories", {
            category_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            category_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            category_image: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            category_slug: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Categories");
    },
};
