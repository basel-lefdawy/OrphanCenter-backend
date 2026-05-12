const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Guardian = sequelize.define("Guardian", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  GuardianID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  GuardianName: DataTypes.STRING,
  GuardianFatherName: DataTypes.STRING,
  GuardianGrandfatherName: DataTypes.STRING,
  GuardianFamilyName: DataTypes.STRING,

  Relation: DataTypes.STRING,

  country: DataTypes.STRING,
  city: DataTypes.STRING,
  street: DataTypes.STRING,

  phoneNumber: {
    type: DataTypes.STRING,
    unique: true, 
  },

  email: {
    type: DataTypes.STRING,
    unique: true, 
  },
});

module.exports = Guardian;