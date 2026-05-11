const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");

const Guardian = sequelize.define("Guardian", {
  GuardianID: DataTypes.STRING,
  GuardianName: DataTypes.STRING,
  GuardianFatherName: DataTypes.STRING,
  GuardianGrandfatherName: DataTypes.STRING,
  GuardianFamilyName: DataTypes.STRING,
  Relation: DataTypes.STRING,
  country: DataTypes.STRING,
  city: DataTypes.STRING,
  street: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  email: DataTypes.STRING,
});

module.exports = Guardian;