const { Sponsor, Sponsorship } = require("../models");

const SPONSORSHIP_INCLUDE = {
  model: Sponsorship,
  as: "sponsorships",
};

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

const getAll = async () => {
  return Sponsor.findAll({
    include: [SPONSORSHIP_INCLUDE],
  });
};

const getById = async (id) => {
  return Sponsor.findByPk(id, {
    include: [SPONSORSHIP_INCLUDE],
  });
};

const create = async (body) => {
  try {
    return await Sponsor.create(body);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw httpError(
        409,
        "رقم الهوية أو البريد الإلكتروني مسجل مسبقاً"
      );
    }

    if (error.name === "SequelizeValidationError") {
      const msg =
        (error.errors &&
          error.errors
            .map((e) => e.message)
            .filter(Boolean)
            .join("; ")) ||
        (error.parent && error.parent.message) ||
        error.message;

      throw httpError(400, msg || "خطأ في التحقق من البيانات");
    }

    throw error;
  }
};

const update = async (id, body) => {
  const sponsor = await Sponsor.findByPk(id);

  if (!sponsor) {
    throw httpError(404, "الكفيل غير موجود");
  }

  try {
    await sponsor.update(body);

    return sponsor;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw httpError(
        409,
        "رقم الهوية أو البريد الإلكتروني مسجل مسبقاً"
      );
    }

    throw error;
  }
};

const remove = async (id) => {
  const sponsor = await Sponsor.findByPk(id);

  if (!sponsor) {
    throw httpError(404, "الكفيل غير موجود");
  }

  await sponsor.destroy();
};

const updateStatus = async (id, status) => {
  if (!["active", "inactive"].includes(status)) {
    throw httpError(400, "الحالة غير صحيحة");
  }

  const sponsor = await Sponsor.findByPk(id);

  if (!sponsor) {
    throw httpError(404, "الكفيل غير موجود");
  }

  await sponsor.update({ status });

  return sponsor;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  updateStatus,
};