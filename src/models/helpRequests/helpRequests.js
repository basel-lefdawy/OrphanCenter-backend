const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const { encrypt } = require("../../utils/crypto");

const HelpRequest = sequelize.define("HelpRequest", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  OrphanID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  OrphanName: DataTypes.STRING,
  OrphanFatherName: DataTypes.STRING,
  OrphanGrandfatherName: DataTypes.STRING,
  OrphanFamilyName: DataTypes.STRING,
  OrphanBirthDate: DataTypes.DATE,

  gender: DataTypes.STRING,
  GuaranteeType: DataTypes.STRING,

  GuardianID: {
    type: DataTypes.STRING,
    allowNull: false,
  },

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

  paymentMethod: DataTypes.STRING,

  IBAN: DataTypes.TEXT,
  bankAccount: DataTypes.TEXT,

  FamilyMember: DataTypes.INTEGER,
  MonthlyIncome: DataTypes.FLOAT,

  status: {
    type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
    defaultValue: "Pending",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// encryption
HelpRequest.beforeCreate((request) => {
  if (request.IBAN) request.IBAN = encrypt(request.IBAN);
  if (request.bankAccount) request.bankAccount = encrypt(request.bankAccount);
});

HelpRequest.beforeUpdate((request) => {
  if (request.IBAN) request.IBAN = encrypt(request.IBAN);
  if (request.bankAccount) request.bankAccount = encrypt(request.bankAccount);
});

module.exports = HelpRequest;