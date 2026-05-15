const { sequelize } = require("../config/db");

const { Orphan,HelpRequest, Guardian,} = require("../models");

const { decrypt } = require("../utils/crypto");

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

// CREATE
const create = async (data) => {

  const exists = await HelpRequest.findOne({
    where: {
      OrphanID: data.OrphanID,
    },
  });

  if (exists) {
    throw httpError(
      409,
      "رقم هوية اليتيم موجود مسبقاً، لا يمكن إنشاء طلب جديد لهذا اليتيم"
    );
  }

  return await HelpRequest.create(data);
};

// GET ALL (DECRYPT)
const getAll = async () => {
  const data = await HelpRequest.findAll({
    order: [["createdAt", "DESC"]],
  });

  return data.map((r) => {
    const obj = r.toJSON();

    return {
      ...obj,
      IBAN: obj.IBAN ? decrypt(obj.IBAN) : null,
      bankAccount: obj.bankAccount ? decrypt(obj.bankAccount) : null,
    };
  });
};

// GET PENDING (DECRYPT)
const getPending = async () => {
  const data = await HelpRequest.findAll({
    where: { status: "Pending" },
    order: [["createdAt", "DESC"]],
  });

  return data.map((r) => {
    const obj = r.toJSON();

    return {
      ...obj,
      IBAN: obj.IBAN ? decrypt(obj.IBAN) : null,
      bankAccount: obj.bankAccount ? decrypt(obj.bankAccount) : null,
    };
  });
};

// GET BY ID
const getById = async (id) => {
  const req = await HelpRequest.findByPk(id);

  if (!req) throw httpError(404, "Request not found");

  const obj = req.toJSON();

  return {
    ...obj,
    IBAN: obj.IBAN ? decrypt(obj.IBAN) : null,
    bankAccount: obj.bankAccount ? decrypt(obj.bankAccount) : null,
  };
};

// UPDATE
const update = async (id, data) => {
  const request = await HelpRequest.findByPk(id);

  if (!request) throw httpError(404, "Request not found");

  await request.update(data);

  return request;
};

// DELETE
const remove = async (id) => {
  const request = await HelpRequest.findByPk(id);

  if (!request) throw httpError(404, "Request not found");

  await request.destroy();

  return true;
};

// APPROVE
const approve = async (id) => {
  const t = await sequelize.transaction();

  try {
    const req = await HelpRequest.findByPk(id, { transaction: t });

    if (!req) {
      await t.rollback();
      throw httpError(404, "Request not found");
    }

    if (req.status !== "Pending") {
      await t.rollback();
      throw httpError(409, "Request already processed");
    }

    let guardian = await Guardian.findOne({
      where: { GuardianID: req.GuardianID },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!guardian) {
      guardian = await Guardian.create(
        {
          GuardianID: req.GuardianID,
          GuardianName: req.GuardianName,
          GuardianFatherName: req.GuardianFatherName,
          GuardianGrandfatherName: req.GuardianGrandfatherName,
          GuardianFamilyName: req.GuardianFamilyName,
          Relation: req.Relation,
          country: req.country,
          city: req.city,
          street: req.street,
          phoneNumber: req.phoneNumber,
          homePhone: req.homePhone,
          email: req.email,
        },
        { transaction: t }
      );
    }

    const existingRelation = await Orphan.findOne({
      where: {
        OrphanID: req.OrphanID,
        GuardianID: req.GuardianID,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (existingRelation) {
      await t.rollback();
      throw httpError(409, "هذا اليتيم مرتبط مسبقاً بهذا الوصي");
    }

    const orphan = await Orphan.create(
      {
        OrphanID: req.OrphanID,
        OrphanName: req.OrphanName,
        OrphanFatherName: req.OrphanFatherName,
        OrphanGrandfatherName: req.OrphanGrandfatherName,
        OrphanFamilyName: req.OrphanFamilyName,
        OrphanBirthDate: req.OrphanBirthDate,
        gender: req.gender,
        GuaranteeType: req.GuaranteeType,
        GuardianID: req.GuardianID,
        RequestID: req.id,
      },
      { transaction: t }
    );

    await req.update(
      { status: "Approved" },
      { transaction: t }
    );

    await t.commit();

    return { req, guardian, orphan };

  } catch (error) {
    if (!t.finished) {
      await t.rollback();
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      const messages = error.errors.map((e) => {
        switch (e.path) {
          case "email":
            return "البريد الإلكتروني مسجل مسبقاً";
          case "phoneNumber":
            return "رقم الهاتف مسجل مسبقاً";
          case "GuardianID":
            return "رقم هوية الوصي مسجل مسبقاً";
          case "OrphanID":
            return "رقم هوية اليتيم مسجل مسبقاً";
          default:
            return `${e.path} مسجل مسبقاً`;
        }
      });

      throw httpError(409, messages.join(" | "));
    }

    throw error;
  }
};

// REJECT
const reject = async (id) => {
  const request = await HelpRequest.findByPk(id);

  if (!request) throw httpError(404, "Request not found");

  if (request.status !== "Pending") {
    throw httpError(409, "Request already processed");
  }

  await request.update({ status: "Rejected" });

  return request;
};

module.exports = {
  create,
  getAll,
  getPending,
  getById,
  update,
  remove,
  approve,
  reject,
};
