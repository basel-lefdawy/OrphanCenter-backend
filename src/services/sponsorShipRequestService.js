const { SponsorshipRequest, Sponsor, Sponsorship, Representative, Orphan, sequelize } = require("../models");

const REQUEST_INCLUDE = {
  model: Orphan,
  as: "orphan",
};

function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

const getAll = async () => {
  return SponsorshipRequest.findAll({
    include: [REQUEST_INCLUDE],
  });
};

const getById = async (id) => {
  return SponsorshipRequest.findByPk(id, {
    include: [REQUEST_INCLUDE],
  });
};

const create = async (body) => {
  try {
    return await SponsorshipRequest.create(body);
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
    return request;
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

  return request;
};

// ─── Approve ──────────────────────────────────────────
const approve = async (id) => {
  const request = await SponsorshipRequest.findByPk(id, {
    include: [REQUEST_INCLUDE],
  });

  if (!request) {
    throw httpError(404, "طلب الكفالة غير موجود");
  }

  if (request.status !== "pending") {
    throw httpError(400, "الطلب تمت معالجته مسبقاً");
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. إنشاء الكفيل
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

    // 2. إنشاء الكفالة
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

    // 3. إنشاء المفوض (اختياري)
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

    // 4. تحديث حالة الطلب
    await request.update({ status: "approved" }, { transaction });

    await transaction.commit();

    return { sponsor, sponsorship, representative };
  } catch (error) {
    await transaction.rollback();

    if (error.name === "SequelizeUniqueConstraintError") {
      throw httpError(409, "رقم الهوية أو البريد الإلكتروني مسجل مسبقاً");
    }

    throw error;
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  updateStatus,
  approve,
};