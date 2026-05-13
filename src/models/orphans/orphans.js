const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Orphan = sequelize.define(
    "Orphan",
    {
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

      RequestID: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "orphans",
      timestamps: false,
    }
  );

  return Orphan;
};