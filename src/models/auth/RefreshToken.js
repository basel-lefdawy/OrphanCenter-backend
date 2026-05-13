const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const RefreshToken = sequelize.define("RefreshToken", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isRevoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = RefreshToken;