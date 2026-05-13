const { DataTypes } = require("sequelize");
const {sequelize} = require("../../config/db");

const Donation = sequelize.define("Donation", {
  donationNumber: {
    type: DataTypes.STRING,
    unique: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  donorName: {
    type: DataTypes.STRING,
    defaultValue: "Anonymous",
  },

  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  currency: {
    type: DataTypes.STRING,
    defaultValue: "ils",
  },

  method: {
    type: DataTypes.STRING,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },

  paymentIntentId: {
    type: DataTypes.STRING,
  },

  email: {
    type: DataTypes.STRING,
  },
});

module.exports = Donation;