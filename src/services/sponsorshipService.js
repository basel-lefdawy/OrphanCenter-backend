const { Sponsorship, Sponsor, Orphan } = require("../models");

const SPONSOR_INCLUDE = {
  model: Sponsor,
  as: "sponsor",
};

const ORPHAN_INCLUDE = {
  model: Orphan,
  as: "orphan",
};

const LIST_INCLUDES = [
  SPONSOR_INCLUDE,
  ORPHAN_INCLUDE,
];

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

const getAll = async () => {
  return Sponsorship.findAll({
    include: LIST_INCLUDES,
  });
};

const getById = async (id) => {
  return Sponsorship.findByPk(id, {
    include: LIST_INCLUDES,
  });
};

const getBySponsorId = async (sponsorId) => {
  const sponsor = await Sponsor.findByPk(sponsorId);

  if (!sponsor) {
    throw httpError(404, "الكفيل غير موجود");
  }

  return Sponsorship.findAll({
    where: { sponsorId },
    include: [ORPHAN_INCLUDE],
  });
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
    if (
      !bankName ||
      !accountNumber ||
      !accountHolderName ||
      !iban
    ) {
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

  return Sponsorship.create({
    ...body,

    bankName:
      paymentMethod === "bank_transfer"
        ? bankName
        : null,

    branchNumber:
      paymentMethod === "bank_transfer"
        ? branchNumber
        : null,

    accountNumber:
      paymentMethod === "bank_transfer"
        ? accountNumber
        : null,

    accountHolderName:
      paymentMethod === "bank_transfer"
        ? accountHolderName
        : null,

    iban:
      paymentMethod === "bank_transfer"
        ? iban
        : null,
  });
};

const update = async (id, body) => {
  const sponsorship = await Sponsorship.findByPk(id);

  if (!sponsorship) {
    throw httpError(404, "الكفالة غير موجودة");
  }

  const payload = { ...body };

  if (
    payload.paymentMethod &&
    payload.paymentMethod !== "bank_transfer"
  ) {
    payload.bankName = null;
    payload.branchNumber = null;
    payload.accountNumber = null;
    payload.accountHolderName = null;
    payload.iban = null;
  }

  await sponsorship.update(payload);

  return sponsorship;
};

const remove = async (id) => {
  const sponsorship = await Sponsorship.findByPk(id);

  if (!sponsorship) {
    throw httpError(404, "الكفالة غير موجودة");
  }

  await sponsorship.destroy();
};

const updateStatus = async (id, status) => {
  if (
    ![
      "pending",
      "approved",
      "rejected",
      "active",
      "expired",
    ].includes(status)
  ) {
    throw httpError(400, "الحالة غير صحيحة");
  }

  const sponsorship = await Sponsorship.findByPk(id);

  if (!sponsorship) {
    throw httpError(404, "الكفالة غير موجودة");
  }

  await sponsorship.update({ status });

  return sponsorship;
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