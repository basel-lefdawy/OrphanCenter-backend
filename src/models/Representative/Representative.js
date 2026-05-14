const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Sponsor = sequelize.define(
    "Sponsor",
    {
      // ─── Primary Key ────────────────────────────────────
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: "sponsor_id — PK",
      },

      // ─── معلومات الكفيل ─────────────────────────────────
      identityNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: "رقم الهوية",
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "الاسم",
      },
      fatherName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "الأب",
      },
      grandfatherName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "الجد",
      },
      familyName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "العائلة",
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "تاريخ الميلاد",
      },
      gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: false,
        comment: "الجنس",
      },
      jobType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "نوع العمل",
      },
      country: {
        type: DataTypes.STRING(60),
        allowNull: false,
        comment: "الدولة",
      },
      city: {
        type: DataTypes.STRING(60),
        allowNull: false,
        comment: "المدينة",
      },
      street: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "الشارع",
      },
      mobile: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "رقم الجوال",
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: "الهاتف",
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: "البريد الإلكتروني",
      },

      // ─── حالة الكفيل ─────────────────────────────────────
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
        comment: "حالة طلب الكفيل",
      },
    },
    {
      tableName: "sponsors",
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  // ─── العلاقات ─────────────────────────────────────────
  Sponsor.associate = (models) => {
    Sponsor.hasMany(models.Sponsorship, {
      foreignKey: "sponsorId",
      as: "sponsorships",
    });

    Sponsor.hasOne(models.Representative, {
      foreignKey: "sponsorId",
      as: "representative",
    });
  };

  return Sponsor;
};