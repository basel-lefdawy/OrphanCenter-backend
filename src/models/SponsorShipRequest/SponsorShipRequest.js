const { DataTypes } = require("sequelize");
const user = require("../auth/user");
module.exports = (sequelize) => {
  const SponsorshipRequest = sequelize.define(
    "SponsorshipRequest",
    {
      // ─── Primary Key ────────────────────────────────────
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: "sponsorship_request_id — PK",
      },

      // ─── معلومات الكفيل ─────────────────────────────────
      identityNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
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
        comment: "البريد الإلكتروني",
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

      // ─── تفاصيل الكفالة ──────────────────────────────────
      orphanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "FK → orphans.id",
      },
      monthlySAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "قيمة الكفالة الشهرية",
      },
      startingSDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "تاريخ بدء الكفالة",
      },
      endSDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "تاريخ انتهاء الكفالة",
      },
      paymentMethod: {
        type: DataTypes.ENUM("bank_transfer", "cash", "check", "electronic"),
        allowNull: false,
        comment: "طريقة الصرف",
      },
      bankName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "اسم البنك",
      },
      branchNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "رقم الفرع",
      },
      accountNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "رقم الحساب",
      },
      accountHolderName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "اسم صاحب الحساب",
      },
      iban: {
        type: DataTypes.STRING(34),
        allowNull: true,
        comment: "رقم الآيبان",
      },

      // ─── حالة الطلب ──────────────────────────────────────
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
        comment: "حالة طلب الكفالة",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      tableName: "sponsorship_requests",
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  // ─── العلاقات ─────────────────────────────────────────
  SponsorshipRequest.associate = (models) => {
    SponsorshipRequest.belongsTo(models.Orphan, {
      foreignKey: "orphanId",
      as: "orphan",
    });
  };
  user.hasMany(SponsorshipRequest, {
    foreignKey: "userId",
  });
  SponsorshipRequest.belongsTo(user, {
    foreignKey: "userId",
  });
  return SponsorshipRequest;
};