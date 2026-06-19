const helpRequestService = require("../services/helpRequestService");
const sponsorshipRequestService = require("../services/sponsorShipRequestService");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const [helpRequests, sponsorshipRequests] = await Promise.all([
      helpRequestService.getByUserId(userId),
      sponsorshipRequestService.getByUserId(userId),
    ]);

    return sendSuccess(res, {
      helpRequests,
      sponsorshipRequests,
    });
  } catch (error) {
    return sendError(res, error.message || "Unable to fetch user requests", error.statusCode || 500);
  }
};

module.exports = {
  getMyRequests,
};