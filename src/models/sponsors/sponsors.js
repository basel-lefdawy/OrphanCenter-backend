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

      representativeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "representatives", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        comment: "المنفذ الذي يمثّل الكفيل",
      },

      // ─── معلومات المفوّض (inline) ────────────────────────
      delegateIdentityNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: "رقم الهوية - المفوض",
      },
      delegateFirstName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "الاسم - المفوض",
      },
      delegateFatherName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "الأب - المفوض",
      },
      delegateGrandfatherName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "الجد - المفوض",
      },
      delegateFamilyName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "العائلة - المفوض",
      },
      delegateJobType: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "نوع العمل - المفوض",
      },
      delegateGender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: true,
        comment: "الجنس - المفوض",
      },
      delegateRelationship: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "صلة القرابة مع الكفيل",
      },
      delegateCountry: {
        type: DataTypes.STRING(60),
        allowNull: true,
        comment: "الدولة - المفوض",
      },
      delegateCity: {
        type: DataTypes.STRING(60),
        allowNull: true,
        comment: "المدينة - المفوض",
      },
      delegateStreet: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "الشارع - المفوض",
      },
      delegateMobile: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: "رقم الجوال - المفوض",
      },

      // ─── حالة الكفيل ─────────────────────────────────────
      status: {
          type: DataTypes.ENUM(
            "pending",
            "approved",
            "rejected"
          ),
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

  // ─── العلاقات حسب الـ ERD ────────────────────────────
  Sponsor.associate = (models) => {
    // Sponsor M ── M Orphan عبر Sponsorship
    Sponsor.hasMany(models.Sponsorship, {
      foreignKey: "sponsorId",
      as: "sponsorships",
    });

    // كل كفيل مرتبط بممثل واحد
    Sponsor.belongsTo(models.Representative, {
      foreignKey: "representativeId",
      as: "representative",
    });
  };

  return Sponsor;
};