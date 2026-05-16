const { Orphan, Sponsor, Sponsorship } = require("../models");
const Donation = require("../models/donations/donations");
const HelpRequest = require("../models/helpRequests/helpRequests");

const HELP_REQUEST_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};
// Helper function to check if a model is found and queryable
function isQueryableModel(model) {
  return model && typeof model.findAll === "function";
}

function getErrorMessage(error) {
  return error?.message || error?.name || "Unknown database/query error";
}

// getDashboardSummary safely queries all required data and handles missing models or query errors gracefully
async function safeFindAll(model, modelName) {
  if (!isQueryableModel(model)) {
    return {
      records: [],
      warning: `${modelName} model is not implemented yet`,
    };
  }

  try {
    const records = await model.findAll({ order: [["id", "DESC"]] });
    return { records, warning: null };
  } catch (error) {
    return {
      records: [],
      warning: `${modelName} query failed: ${getErrorMessage(error)}`,
    };
  }
}

// evaluate sponsored orphan count with error handling and fallback value
async function safeSponsoredOrphanCount() {
  if (!Sponsorship || typeof Sponsorship.count !== "function") {
    return {
      count: 0,
      warning: "Sponsorship model is not implemented yet; sponsored count defaults to 0",
    };
  }

  try {
    const count = await Sponsorship.count({
      distinct: true,
      col: "orphanId",
    });

    return { count, warning: null };
  } catch (error) {
    return {
      count: 0,
      warning: `Sponsored orphan count failed: ${getErrorMessage(error)}`,
    };
  }
}

// Main function to get dashboard summary with robust error handling and fallback values
async function getDashboardSummary() {
  const [
    orphansResult,
    sponsorsResult,
    donationsResult,
    helpRequestsResult,
    sponsoredCountResult,
  ] = await Promise.all([
    safeFindAll(Orphan, "Orphan"),
    safeFindAll(Sponsor, "Sponsor"),
    safeFindAll(Donation, "Donation"),
    safeFindAll(HelpRequest, "HelpRequest"),
    safeSponsoredOrphanCount(),
  ]);

  const orphans = orphansResult.records;
  const sponsors = sponsorsResult.records;
  const donations = donationsResult.records;
  const helpRequests = helpRequestsResult.records;
  const sponsoredCount = sponsoredCountResult.count;

  const totalDonations = donations.reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0
  );

  const pendingRequests = helpRequests.filter(
    (request) => request.status === HELP_REQUEST_STATUS.PENDING
  );

  const helpRequestStatuses = helpRequests.reduce(
    (acc, request) => {
      if (request.status === HELP_REQUEST_STATUS.PENDING) acc.pending += 1;
      if (request.status === HELP_REQUEST_STATUS.APPROVED) acc.approved += 1;
      if (request.status === HELP_REQUEST_STATUS.REJECTED) acc.rejected += 1;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0 }
  );

  const warnings = [
    orphansResult.warning,
    sponsorsResult.warning,
    donationsResult.warning,
    helpRequestsResult.warning,
    sponsoredCountResult.warning,
  ].filter(Boolean);

  return {
    counts: {
      orphans: orphans.length,
      sponsors: sponsors.length,
      donations: donations.length,
      helpRequests: helpRequests.length,
      sponsoredOrphans: sponsoredCount,
      pendingHelpRequests: pendingRequests.length,
    },
    helpRequestStatuses,
    totalDonations,
    sponsorshipRate:
      orphans.length > 0 ? Math.round((sponsoredCount / orphans.length) * 100) : 0,
    recent: {
      orphans: orphans.slice(0, 4),
      donations: donations.slice(0, 4),
    },
    warnings,
  };
}

module.exports = {
  getDashboardSummary,
};
