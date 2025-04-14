"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Size extends Model {}
    Size.init(
        {
            size_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            size_slug: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Size",
            timestamps: false,
        }
    );
    return Size;
};
