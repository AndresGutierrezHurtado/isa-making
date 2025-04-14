"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Media extends Model {}
    Media.init(
        {
            media_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            product_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            media_image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Media",
            tableName: "Medias",
            timestamps: false,
        }
    );
    return Media;
};
