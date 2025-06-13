"use strict";

const { orders, orderProducts, paymentDetails, shippingDetails, shippingHistories } = require("./data.json");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         */
        if (orders.length > 0) await queryInterface.bulkInsert("Orders", orders, {});
        if (orderProducts.length > 0) await queryInterface.bulkInsert("OrderProducts", orderProducts, {});
        if (paymentDetails.length > 0) await queryInterface.bulkInsert("PaymentDetails", paymentDetails, {});
        if (shippingDetails.length > 0) await queryInterface.bulkInsert("ShippingDetails", shippingDetails, {});
        if (shippingHistories.length > 0) await queryInterface.bulkInsert("ShippingHistories", shippingHistories, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         */
        await queryInterface.bulkDelete("Orders", null, {});
        await queryInterface.bulkDelete("OrderProducts", null, {});
        await queryInterface.bulkDelete("PaymentDetails", null, {});
        await queryInterface.bulkDelete("ShippingDetails", null, {});
        await queryInterface.bulkDelete("ShippingHistories", null, {});
    },
};
