const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Sponsorship = sequelize.define(
    "Sponsorship",
    {
      // ─── Primary Key ────────────────────────────────────
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      // ─── Foreign Keys من الـ ERD ─────────────────────────
      // ERD: Orphan 1 ── M Sponsorship
      orphanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "orphans", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        comment: "FK → orphans.id",
      },
      // ERD: Sponsor M ── M Sponsorship
      sponsorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "sponsors", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        comment: "FK → sponsors.id",
      },

      // ─── تفاصيل الكفالة (من فورم الموقع بالزبط) ─────────
      monthlySAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: "قيمة الكفالة الشهرية — monthly_s_amount",
      },
      startingSDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "تاريخ بدء الكفالة — starting_s_date",
      },
      endSDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "تاريخ انتهاء الكفالة — end_s_date",
      },

      // ─── طريقة الصرف (من فورم الموقع بالزبط) ────────────
      paymentMethod: {
        type: DataTypes.ENUM(
          "bank_transfer",
          "cash",
          "check",
          "electronic"
        ),
        allowNull: false,
        comment: "طريقة الصرف — payment_method",
      },

      // ─── تفاصيل البنك (تظهر فقط لما paymentMethod = bank_transfer) ──
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
        comment: "رقم الحساب البنكي",
      },
      accountHolderName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "اسم صاحب الحساب",
      },
      iban: {
        type: DataTypes.STRING(34),
        allowNull: true,
        comment: "IBAN",
      },

      // ─── حالة الكفالة ────────────────────────────────────
      status: {
        type: DataTypes.ENUM(
          "pending",
          "approved",
          "rejected",
          "active",
          "expired"
        ),
        defaultValue: "pending",
        comment: "حالة طلب الكفالة",
      },
    },
    {
      tableName: "sponsorships",
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  // ─── العلاقات حسب الـ ERD ────────────────────────────
  Sponsorship.associate = (models) => {
    // Sponsorship ← Sponsor  (M من جهة Sponsor)
    Sponsorship.belongsTo(models.Sponsor, {
      foreignKey: "sponsorId",
      as: "sponsor",
    });

    // Sponsorship ← Orphan  (1 من جهة Orphan)
    Sponsorship.belongsTo(models.Orphan, {
      foreignKey: "orphanId",
      as: "orphan",
    });
  };

  return Sponsorship;
};