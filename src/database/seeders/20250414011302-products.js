"use strict";

const { products, medias, sizes, categories, productCategories, productSizes } = require("./data.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         */
        if (products.length > 0) await queryInterface.bulkInsert("Products", products, {});
        if (medias.length > 0) await queryInterface.bulkInsert("Medias", medias, {});
        if (sizes.length > 0) await queryInterface.bulkInsert("Sizes", sizes, {});
        if (categories.length > 0) await queryInterface.bulkInsert("Categories", categories, {});
        if (productCategories.length > 0) await queryInterface.bulkInsert("ProductCategories", productCategories, {});
        if (productSizes.length > 0) await queryInterface.bulkInsert("ProductSizes", productSizes, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         */
        await queryInterface.bulkDelete("Products", null, {});
        await queryInterface.bulkDelete("Medias", null, {});
        await queryInterface.bulkDelete("Sizes", null, {});
        await queryInterface.bulkDelete("Categories", null, {});
        await queryInterface.bulkDelete("ProductCategories", null, {});
        await queryInterface.bulkDelete("ProductSizes", null, {});
    },
};
