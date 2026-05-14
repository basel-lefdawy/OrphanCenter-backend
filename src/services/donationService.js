const stripe = require("../config/stripe");

const Donation = require("../models/donations/donations");

const generateDonationNumber = require(
  "../utils/generateDonationNumber"
);



// =========================
// CREATE DONATION
// =========================
const createDonation = async (data) => {
  const paymentIntent =
    await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),

      currency: "usd",

      automatic_payment_methods: {
        enabled: true,
      },
    });

  let donorName = "Anonymous";

  if (!data.isAnonymous) {
    donorName =
      `${data.firstName || ""} ${
        data.lastName || ""
      }`.trim();
  }

  const donationNumber =
    generateDonationNumber();

  const donation = await Donation.create({
    donationNumber,

    userId: data.userId || null,

    donorName,

    isAnonymous: data.isAnonymous,

    amount: data.amount,

    method: data.method,

    email: data.email,

    paymentIntentId: paymentIntent.id,

    status: "pending",
  });

  return {
    clientSecret:
      paymentIntent.client_secret,

    donationNumber:
      donation.donationNumber,
  };
};



// =========================
// GET ALL DONATIONS
// =========================
const getAllDonations = async () => {
  return await Donation.findAll({
    order: [["createdAt", "DESC"]],
  });
};



// =========================
// GET ONE DONATION
// =========================
const getDonationById = async (id) => {
  return await Donation.findByPk(id);
};



// =========================
// UPDATE DONATION
// =========================
const updateDonation = async (
  id,
  data
) => {
  const donation =
    await Donation.findByPk(id);

  if (!donation) {
    return null;
  }

  await donation.update(data);

  return donation;
};



// =========================
// DELETE DONATION
// =========================
const deleteDonation = async (id) => {
  const donation =
    await Donation.findByPk(id);

  if (!donation) {
    return null;
  }

  await donation.destroy();

  return true;
};



// =========================
// MARK AS PAID
// =========================
const markDonationAsPaid = async (
  paymentIntentId
) => {
  const donation =
    await Donation.findOne({
      where: {
        paymentIntentId,
      },
    });

  if (!donation) {
    return null;
  }

  donation.status = "paid";

  await donation.save();

  return donation;
};



module.exports = {
  create: createDonation,

  createDonation,

  getAll: getAllDonations,

  getAllDonations,

  getOne: getDonationById,

  getDonationById,

  update: updateDonation,

  updateDonation,

  delete: deleteDonation,

  deleteDonation,

  markAsPaid: markDonationAsPaid,

  markDonationAsPaid,
};
