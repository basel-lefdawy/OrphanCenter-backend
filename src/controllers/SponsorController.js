const sponsorService = require("../services/sponsorService");
const { getClientErrorMessage } = require("../utils/errorMessage");
const { sponsorSchema } = require("../schemas/sponsorSchema");

const getAllSponsors = async (req, res) => {
  try {
    const sponsors = await sponsorService.getAll();
    res.status(200).json({ success: true, data: sponsors });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const getSponsorById = async (req, res) => {
  try {
    const sponsor = await sponsorService.getById(req.params.id);
    if (!sponsor) {
      return res
        .status(404)
        .json({ success: false, message: "الكفيل غير موجود" });
    }
    res.status(200).json({ success: true, data: sponsor });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const createSponsor = async (req, res) => {
  try {
    const validatedData = sponsorSchema.parse(req.body);
    const sponsor = await sponsorService.create(validatedData);
    res.status(201).json({ success: true, data: sponsor });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const updateSponsor = async (req, res) => {
  try {
    const validatedData = sponsorSchema.partial().parse(req.body);
    const sponsor = await sponsorService.update(req.params.id, validatedData);
    res.status(200).json({ success: true, data: sponsor });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const deleteSponsor = async (req, res) => {
  try {
    await sponsorService.remove(req.params.id);
    res.status(200).json({ success: true, message: "تم حذف الكفيل بنجاح" });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const updateSponsorStatus = async (req, res) => {
  try {
    const validatedData = sponsorSchema.partial().parse(req.body);
    const sponsor = await sponsorService.updateStatus(req.params.id, validatedData.status);
    res.status(200).json({ success: true, data: sponsor });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

module.exports = {
  getAllSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  updateSponsorStatus,
};
