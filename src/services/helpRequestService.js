const { sequelize } = require("../config/db");

const HelpRequest = require("../models/helpRequests/helpRequests");
const Orphan = require("../models/orphans/orphans");
const Guardian = require("../models/guardian/guardian");

const { decrypt } = require("../utils/crypto");


// CREATE
const create = async (data) => {
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


// GET BY ID (DECRYPT)
const getById = async (id) => {
  const req = await HelpRequest.findByPk(id);

  if (!req) return null;

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

  if (!request) return null;

  await request.update(data);

  return request;
};


// DELETE
const remove = async (id) => {
  const request = await HelpRequest.findByPk(id);

  if (!request) return null;

  await request.destroy();

  return true;
};


// APPROVE (FIXED SAFE VERSION)
const approve = async (id) => {
  const t = await sequelize.transaction();

  try {
    const req = await HelpRequest.findByPk(id, { transaction: t });

    if (!req) {
      await t.rollback();
      return null;
    }

    if (req.status === "Approved") {
      await t.rollback();
      throw new Error("Request already approved");
    }

    // update status
    await req.update(
      { status: "Approved" },
      { transaction: t }
    );

    // create guardian
    const guardian = await Guardian.create(
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
        email: req.email,
      },
      { transaction: t }
    );

    // create orphan
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

        GuardianID: guardian.GuardianID,
        RequestID: req.id,
      },
      { transaction: t }
    );

    await t.commit();

    return { req, guardian, orphan };

  } catch (err) {
    await t.rollback();
    throw err;
  }
};


// REJECT
const reject = async (id) => {
  const request = await HelpRequest.findByPk(id);

  if (!request) return null;

  if (request.status === "Rejected") {
    throw new Error("Request already rejected");
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