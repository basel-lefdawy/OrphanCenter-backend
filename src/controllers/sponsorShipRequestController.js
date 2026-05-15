const sponsorshipRequestService = require("../services/sponsorshipRequestService");
const {
  sponsorshipRequestSchema,
  sponsorshipRequestUpdateSchema,
} = require("../schemas/sponsorshipRequestSchema");
const { getClientErrorMessage } = require("../utils/errorMessage");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const getAllSponsorshipRequests = async (req, res) => {
  try {
    const requests = await sponsorshipRequestService.getAll();
    return sendSuccess(res, requests);
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const getPendingSponsorshipRequests = async (req, res) => {
  try {
    const requests = await sponsorshipRequestService.getPending();
    return sendSuccess(res, requests);
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const getSponsorshipRequestById = async (req, res) => {
  try {
    const request = await sponsorshipRequestService.getById(req.params.id);
    if (!request) {
      return sendError(res, "طلب الكفالة غير موجود", 404);
    }
    return sendSuccess(res, request);
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const createSponsorshipRequest = async (req, res) => {
  try {
    const validatedData = sponsorshipRequestSchema.parse(req.body);
    const userId = req.user.id; // I took it from requireAuth middleware
    validatedData.userId = userId; // Attach the userId to the validated data
    const request = await sponsorshipRequestService.create(validatedData);
    return sendSuccess(res, request, "تم إنشاء طلب الكفالة بنجاح", 201);
  } catch (error) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation Error", 400, error.issues || []);
    }
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const updateSponsorshipRequest = async (req, res) => {
  try {
    const validatedData = sponsorshipRequestUpdateSchema.parse(req.body);
    const request = await sponsorshipRequestService.update(req.params.id, validatedData);
    return sendSuccess(res, request);
  } catch (error) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation Error", 400, error.issues || []);
    }
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const deleteSponsorshipRequest = async (req, res) => {
  try {
    await sponsorshipRequestService.remove(req.params.id);
    return sendSuccess(res, null, "تم حذف طلب الكفالة بنجاح");
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const approveSponsorshipRequest = async (req, res) => {
  try {
    const result = await sponsorshipRequestService.approve(req.params.id);
    return sendSuccess(res, result, "تمت الموافقة على طلب الكفالة بنجاح");
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

const rejectSponsorshipRequest = async (req, res) => {
  try {
    const request = await sponsorshipRequestService.reject(req.params.id);
    return sendSuccess(res, request, "تم رفض طلب الكفالة");
  } catch (error) {
    return sendError(res, getClientErrorMessage(error), error.statusCode || 500);
  }
};

module.exports = {
  getAllSponsorshipRequests,
  getPendingSponsorshipRequests,
  getSponsorshipRequestById,
  createSponsorshipRequest,
  updateSponsorshipRequest,
  deleteSponsorshipRequest,
  approveSponsorshipRequest,
  rejectSponsorshipRequest,
};