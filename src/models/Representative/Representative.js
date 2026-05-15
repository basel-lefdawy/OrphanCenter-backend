const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Representative = sequelize.define(
    "Representative",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      identityNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      fatherName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      grandfatherName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      familyName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: true,
      },
      jobType: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      relationship: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      street: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      mobile: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    {
      tableName: "representatives",
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  Representative.associate = (models) => {
    Representative.hasMany(models.Sponsor, {
      foreignKey: "representativeId",
      as: "sponsors",
    });
  };

  return Representative;
};