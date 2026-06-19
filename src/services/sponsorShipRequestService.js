const { SponsorshipRequest, Sponsor, Sponsorship, Representative, Orphan, sequelize } = require("../models");
const { decrypt } = require("../utils/crypto");

const REQUEST_INCLUDE = {
  model: Orphan,
  as: "orphan",
};

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

const decryptRequest = (request) => {
  if (!request) return null;

  const obj = request.toJSON();

  return {
    ...obj,
    accountNumber: obj.accountNumber ? decrypt(obj.accountNumber) : null,
    iban: obj.iban ? decrypt(obj.iban) : null,
  };
};

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
  const requests = await SponsorshipRequest.findAll({
    include: [REQUEST_INCLUDE],
    order: [["createdAt", "DESC"]],
  });

  return requests.map(decryptRequest);
};

const getPending = async () => {
  const requests = await SponsorshipRequest.findAll({
    where: { status: "pending" },
    include: [REQUEST_INCLUDE],
    order: [["createdAt", "DESC"]],
  });

  return requests.map(decryptRequest);
};

const getByUserId = async (userId) => {
  const requests = await SponsorshipRequest.findAll({
    where: { userId },
    include: [REQUEST_INCLUDE],
    order: [["createdAt", "DESC"]],
  });

  return requests.map(decryptRequest);
};

const getById = async (id) => {
  const request = await SponsorshipRequest.findByPk(id, {
    include: [REQUEST_INCLUDE],
  });

  return decryptRequest(request);
};

const create = async (body) => {
  try {
    const request = await SponsorshipRequest.create(body);
    return decryptRequest(request);
  } catch (error) {
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
  const request = await SponsorshipRequest.findByPk(id);

  if (!request) {
    throw httpError(404, "طلب الكفالة غير موجود");
  }

  if (request.status !== "pending") {
    throw httpError(400, "لا يمكن تعديل طلب تمت معالجته");
  }

  try {
    await request.update(body);
    return decryptRequest(request);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const msg =
        (error.errors &&
          error.errors
            .map((e) => e.message)
            .filter(Boolean)
            .join("; ")) ||
        error.message;

      throw httpError(400, msg || "خطأ في التحقق من البيانات");
    }

    throw error;
  }
};

const remove = async (id) => {
  const request = await SponsorshipRequest.findByPk(id);

  if (!request) {
    throw httpError(404, "طلب الكفالة غير موجود");
  }

  if (request.status !== "pending") {
    throw httpError(400, "لا يمكن حذف طلب تمت معالجته");
  }

  await request.destroy();
};

const updateStatus = async (id, status) => {
  if (!["pending", "approved", "rejected"].includes(status)) {
    throw httpError(400, "الحالة غير صحيحة");
  }

  const request = await SponsorshipRequest.findByPk(id);

  if (!request) {
    throw httpError(404, "طلب الكفالة غير موجود");
  }

  await request.update({ status });

  return decryptRequest(request);
};

const approve = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const request = await SponsorshipRequest.findByPk(id, {
      include: [REQUEST_INCLUDE],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!request) {
      await transaction.rollback();
      throw httpError(404, "طلب الكفالة غير موجود");
    }

    if (request.status !== "pending") {
      await transaction.rollback();
      throw httpError(409, "الطلب تمت معالجته مسبقاً");
    }

    const sponsor = await Sponsor.create(
      {
        identityNumber: request.identityNumber,
        firstName: request.firstName,
        fatherName: request.fatherName,
        grandfatherName: request.grandfatherName,
        familyName: request.familyName,
        dateOfBirth: request.dateOfBirth,
        gender: request.gender,
        jobType: request.jobType,
        country: request.country,
        city: request.city,
        street: request.street,
        mobile: request.mobile,
        phone: request.phone,
        email: request.email,
        status: "approved",
      },
      { transaction }
    );

    const sponsorship = await Sponsorship.create(
      {
        sponsorId: sponsor.id,
        orphanId: request.orphanId,
        monthlySAmount: request.monthlySAmount,
        startingSDate: request.startingSDate,
        endSDate: request.endSDate,
        paymentMethod: request.paymentMethod,
        bankName: request.bankName,
        branchNumber: request.branchNumber,
        accountNumber: request.accountNumber,
        accountHolderName: request.accountHolderName,
        iban: request.iban,
        status: "active",
      },
      { transaction }
    );

    let representative = null;
    if (request.delegateFirstName) {
      representative = await Representative.create(
        {
          sponsorId: sponsor.id,
          identityNumber: request.delegateIdentityNumber,
          firstName: request.delegateFirstName,
          fatherName: request.delegateFatherName,
          grandfatherName: request.delegateGrandfatherName,
          familyName: request.delegateFamilyName,
          gender: request.delegateGender,
          jobType: request.delegateJobType,
          relationship: request.delegateRelationship,
          country: request.delegateCountry,
          city: request.delegateCity,
          street: request.delegateStreet,
          mobile: request.delegateMobile,
        },
        { transaction }
      );
    }

    await request.update({ status: "approved" }, { transaction });
    await transaction.commit();

    return {
      sponsor,
      sponsorship: decryptSponsorship(sponsorship),
      representative,
    };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    throw error;
  }
};

const reject = async (id) => {
  const request = await SponsorshipRequest.findByPk(id);

  if (!request) {
    throw httpError(404, "طلب الكفالة غير موجود");
  }

  if (request.status !== "pending") {
    throw httpError(409, "الطلب تمت معالجته مسبقاً");
  }

  await request.update({ status: "rejected" });

  return decryptRequest(request);
};

module.exports = {
  getAll,
  getPending,
  getByUserId,
  getById,
  create,
  update,
  remove,
  updateStatus,
  approve,
  reject,
};