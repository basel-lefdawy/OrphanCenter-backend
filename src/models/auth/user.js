const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const HelpRequest = require("../helpRequests/helpRequests");
const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user",
        },

        provider: {
            type: DataTypes.ENUM(
                "local",
                "google",
                "facebook"
            ),
            defaultValue: "local",
        },

        providerId: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        resetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        emailVerificationToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        emailVerificationExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: "users",
        timestamps: true,
    }
);

module.exports = User;