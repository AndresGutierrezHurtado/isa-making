"use strict";

const { users, roles } = require("./data.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         */
        if (users.length > 0) await queryInterface.bulkInsert("Users", users, {});
        if (roles.length > 0) await queryInterface.bulkInsert("Roles", roles, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         */
        if (users.length > 0) await queryInterface.bulkDelete("Users", null, {});
        if (roles.length > 0) await queryInterface.bulkDelete("Roles", null, {});
    },
};
