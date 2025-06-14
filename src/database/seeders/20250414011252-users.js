"use strict";

const { users, roles, carts } = require("./data.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         */
        if (users.length > 0) await queryInterface.bulkInsert("Users", users, {});
        if (roles.length > 0) await queryInterface.bulkInsert("Roles", roles, {});
        if (carts.length > 0) await queryInterface.bulkInsert("Carts", carts, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         */
        await queryInterface.bulkDelete("Users", null, {});
        await queryInterface.bulkDelete("Roles", null, {});
        await queryInterface.bulkDelete("Carts", null, {});
    },
};
