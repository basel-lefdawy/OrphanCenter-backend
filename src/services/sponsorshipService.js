const { Sponsorship, Sponsor, Orphan } = require("../models");
const { decrypt } = require("../utils/crypto");

const SPONSOR_INCLUDE = {
  model: Sponsor,
  as: "sponsor",
};

const ORPHAN_INCLUDE = {
  model: Orphan,
  as: "orphan",
};

const LIST_INCLUDES = [SPONSOR_INCLUDE, ORPHAN_INCLUDE];

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

const decryptSponsorship = (sponsorship) => {
  if (!sponsorship) return null;

  const obj = sponsorship.toJSON();

  return {
    ...obj,
    accountNumber: obj.accountNumber ? decrypt(obj.accountNumber) : null,
    iban: obj.iban ? decrypt(obj.iban) : null,
  };
};

const getAll = async () => {
  const sponsorships = await Sponsorship.findAll({
    include: LIST_INCLUDES,
  });

  return sponsorships.map(decryptSponsorship);
};

const getById = async (id) => {
  const sponsorship = await Sponsorship.findByPk(id, {
    include: LIST_INCLUDES,
  });

  return decryptSponsorship(sponsorship);
};

const getBySponsorId = async (sponsorId) => {
  const sponsor = await Sponsor.findByPk(sponsorId);

  if (!sponsor) {
    throw httpError(404, "الكفيل غير موجود");
  }

  const sponsorships = await Sponsorship.findAll({
    where: { sponsorId },
    include: [ORPHAN_INCLUDE],
  });

  return sponsorships.map(decryptSponsorship);
};

const create = async (body) => {
  const {
    paymentMethod,
    sponsorId,
    orphanId,
    bankName,
    branchNumber,
    accountNumber,
    accountHolderName,
    iban,
  } = body;

  if (paymentMethod === "bank_transfer") {
    if (!bankName || !accountNumber || !accountHolderName || !iban) {
      throw httpError(
        400,
        "يرجى تعبئة جميع تفاصيل البنك عند اختيار التحويل البنكي"
      );
    }
  }

  const [sponsor, orphan] = await Promise.all([
    Sponsor.findByPk(sponsorId),
    Orphan.findByPk(orphanId),
  ]);

  if (!sponsor) {
    throw httpError(404, "الكفيل غير موجود");
  }

  if (!orphan) {
    throw httpError(404, "اليتيم غير موجود");
  }

  const sponsorship = await Sponsorship.create({
    ...body,
    bankName: paymentMethod === "bank_transfer" ? bankName : null,
    branchNumber: paymentMethod === "bank_transfer" ? branchNumber : null,
    accountNumber: paymentMethod === "bank_transfer" ? accountNumber : null,
    accountHolderName: paymentMethod === "bank_transfer" ? accountHolderName : null,
    iban: paymentMethod === "bank_transfer" ? iban : null,
  });

  return decryptSponsorship(sponsorship);
};

const update = async (id, body) => {
  const sponsorship = await Sponsorship.findByPk(id);

  if (!sponsorship) {
    throw httpError(404, "الكفالة غير موجودة");
  }

  const payload = { ...body };

  if (payload.paymentMethod && payload.paymentMethod !== "bank_transfer") {
    payload.bankName = null;
    payload.branchNumber = null;
    payload.accountNumber = null;
    payload.accountHolderName = null;
    payload.iban = null;
  }

  await sponsorship.update(payload);

  return decryptSponsorship(sponsorship);
};

const remove = async (id) => {
  const sponsorship = await Sponsorship.findByPk(id);

  if (!sponsorship) {
    throw httpError(404, "الكفالة غير موجودة");
  }

  await sponsorship.destroy();
};

const updateStatus = async (id, status) => {
  if (!["pending", "approved", "rejected", "active", "expired"].includes(status)) {
    throw httpError(400, "الحالة غير صحيحة");
  }

  const sponsorship = await Sponsorship.findByPk(id);

  if (!sponsorship) {
    throw httpError(404, "الكفالة غير موجودة");
  }

  await sponsorship.update({ status });

  return decryptSponsorship(sponsorship);
};

module.exports = {
  getAll,
  getById,
  getBySponsorId,
  create,
  update,
  remove,
  updateStatus,
};