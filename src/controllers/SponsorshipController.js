const sponsorshipService = require("../services/sponsorshipService");
const { getClientErrorMessage } = require("../utils/errorMessage");
const { sponsorShipSchema } = require("../schemas/sponsorShipSchema");

const getAllSponsorships = async (req, res) => {
  try {
    const sponsorships = await sponsorshipService.getAll();
    res.status(200).json({ success: true, data: sponsorships });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const getSponsorshipById = async (req, res) => {
  try {
    const sponsorship = await sponsorshipService.getById(req.params.id);
    if (!sponsorship) {
      return res
        .status(404)
        .json({ success: false, message: "الكفالة غير موجودة" });
    }
    res.status(200).json({ success: true, data: sponsorship });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const getSponsorshipsBySponsor = async (req, res) => {
  try {
    const sponsorships = await sponsorshipService.getBySponsorId(req.params.sponsorId);
    res.status(200).json({ success: true, data: sponsorships });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const createSponsorship = async (req, res) => {
  try {
    const validatedData = sponsorShipSchema.parse(req.body);
    const sponsorship = await sponsorshipService.create(validatedData);
    res.status(201).json({ success: true, data: sponsorship });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const updateSponsorship = async (req, res) => {
  try {
    const validatedData = sponsorShipSchema.partial().parse(req.body);
    const sponsorship = await sponsorshipService.update(req.params.id, validatedData);
    res.status(200).json({ success: true, data: sponsorship });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const deleteSponsorship = async (req, res) => {
  try {
    await sponsorshipService.remove(req.params.id);
    res.status(200).json({ success: true, message: "تم حذف الكفالة بنجاح" });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ success: false, message: getClientErrorMessage(error) });
  }
};

const updateSponsorshipStatus = async (req, res) => {
  try {
    const validatedData = sponsorShipSchema.partial().parse(req.body);

    const sponsorship = await sponsorshipService.updateStatus(
      req.params.id,
      validatedData.status
    );

    res.status(200).json({
      success: true,
      data: sponsorship,
    });
  } catch (error) {
    const status = error.statusCode || 500;

    res.status(status).json({
      success: false,
      message: getClientErrorMessage(error),
    });
  }
};

module.exports = {
  getAllSponsorships,
  getSponsorshipById,
  getSponsorshipsBySponsor,
  createSponsorship,
  updateSponsorship,
  deleteSponsorship,
  updateSponsorshipStatus,
};
