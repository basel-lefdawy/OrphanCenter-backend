const dashboardService = require("../services/dashboardService");
const { sendSuccess, sendError } = require("../utils/apiResponse");

async function getDashboardSummary(req, res) {
  try {
    const summary = await dashboardService.getDashboardSummary();
    return sendSuccess(res, summary);
  } catch (error) {
    return sendError(res, error.message);
  }
}

module.exports = {
  getDashboardSummary,
};
