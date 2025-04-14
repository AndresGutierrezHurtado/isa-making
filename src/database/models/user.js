"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {}
    User.init(
        {
            user_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            user_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_lastname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            user_password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
        },
        {
            sequelize,
            modelName: "User",
            timestamps: true,
            paranoid: true,
        }
    );

    User.beforeCreate((user, options) => {
        user.user_password = bcrypt.hashSync(user.user_password, 10);
    });

    User.beforeUpdate((user, options) => {
        if (user.user_password) {
            user.user_password = bcrypt.hashSync(user.user_password, 10);
        }
    });

    return User;
};
