const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Orphan = sequelize.define(
    "Orphan",
    {
      OrphanID: DataTypes.STRING,
      OrphanName: DataTypes.STRING,
      OrphanFatherName: DataTypes.STRING,
      OrphanGrandfatherName: DataTypes.STRING,
      OrphanFamilyName: DataTypes.STRING,
      OrphanBirthDate: DataTypes.DATE,
      gender: DataTypes.STRING,
      GuaranteeType: DataTypes.STRING,
      GuardianID: DataTypes.STRING,
      RequestID: DataTypes.INTEGER,
    },
    {
      tableName: "orphans",
      timestamps: false,
    }
  );
  return Orphan;
};