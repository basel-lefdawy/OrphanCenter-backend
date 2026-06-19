const HelpRequestService = require("../services/helpRequestService");
const { helpRequestSchema } = require("../schemas/helpRequestSchema");
const { z } = require("zod");

const helpRequestUpdateSchema = z.object({
  status: z.enum(["Pending", "Approved", "Rejected"]).optional(),
});

// FORMAT ZOD ERRORS
const formatValidationErrors = (errors) => {
  return (errors || []).map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));
};

// CREATE
const createRequest = async (req, res) => {
  try {

    const validatedData =
      helpRequestSchema.parse(req.body);
    const userId = req.user.id; // I took it from requireAuth middleware
    console.log("[HelpRequest Controller] req.user:", req.user);
    console.log("[HelpRequest Controller] userId:", userId);

    const data =
      await HelpRequestService.create(
        validatedData,
        userId
      );

    return res.status(201).json({
      success: true,
      message: "تم إرسال الطلب بنجاح",
      data,
    });

  } catch (err) {

    // ZOD VALIDATION
    if (err.name === "ZodError") {
      const errors = err.issues || err.errors || [];
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: formatValidationErrors(errors),
      });
    }

    // CUSTOM ERRORS
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

// GET ALL
const getAllRequests = async (req, res) => {
  try {

    const data =
      await HelpRequestService.getAll();

    return res.json(data);

  } catch (err) {

    return res.status(500).json({
      message: err.message,
    });
  }
};

// GET PENDING
const getPendingRequests = async (req, res) => {
  try {

    const data =
      await HelpRequestService.getPending();

    return res.json(data);

  } catch (err) {

    return res.status(500).json({
      message: err.message,
    });
  }
};

// GET ONE
const getRequestById = async (req, res) => {
  try {

    const data =
      await HelpRequestService.getById(
        req.params.id
      );

    if (!data) {

      return res.status(404).json({
        message: "الطلب غير موجود",
      });
    }

    return res.json(data);

  } catch (err) {

    return res.status(500).json({
      message: err.message,
    });
  }
};

// UPDATE
const updateRequest = async (req, res) => {
  try {

    const validatedData =
      helpRequestUpdateSchema.parse(req.body);

    const data =
      await HelpRequestService.update(
        req.params.id,
        validatedData
      );

    if (!data) {

      return res.status(404).json({
        message: "الطلب غير موجود",
      });
    }

    return res.json(data);

  } catch (err) {

    // ZOD VALIDATION
    if (err.name === "ZodError") {
      const errors = err.issues || err.errors || [];

      return res.status(400).json({
        message: "Validation Error",
        errors: formatValidationErrors(
          errors
        ),
      });
    }

    return res
      .status(err.statusCode || 500)
      .json({
        message:
          err.message ||
          "Internal Server Error",
      });
  }
};

// DELETE
const deleteRequest = async (req, res) => {
  try {
    const data = await HelpRequestService.remove(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "الطلب غير موجود",
      });
    }

    return res.json({
      success: true,
    });

  } catch (err) {

    return res.status(500).json({
      message: err.message,
    });
  }
};

// APPROVE
const approveRequest = async (req, res) => {
  try {

    const data =
      await HelpRequestService.approve(
        req.params.id
      );

    return res.json(data);

  } catch (err) {

    return res
      .status(err.statusCode || 500)
      .json({
        message: err.message,
      });
  }
};

// REJECT
const rejectRequest = async (req, res) => {
  try {

    const data =
      await HelpRequestService.reject(
        req.params.id
      );

    return res.json(data);

  } catch (err) {

    return res
      .status(err.statusCode || 500)
      .json({
        message: err.message,
      });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getPendingRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  approveRequest,
  rejectRequest,
};

