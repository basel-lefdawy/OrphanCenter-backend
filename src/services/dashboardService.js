const { Op } = require("sequelize");
const Orphan = require("../models/orphans/orphans");
const Sponsor = require("../models/sponsors/sponsors");
const Donation = require("../models/donations/donations");
const HelpRequest = require("../models/helpRequests/helpRequests");

async function getDashboardSummary() {
  const [orphans, sponsors, donations, helpRequests] = await Promise.all([
    Orphan.findAll({ order: [["id", "DESC"]] }),
    Sponsor.findAll({ order: [["id", "DESC"]] }),
    Donation.findAll({ order: [["id", "DESC"]] }),
    HelpRequest.findAll({ order: [["id", "DESC"]] }),
  ]);

  const sponsoredCount = await Orphan.count({
    where: {
      sponsorId: {
        [Op.ne]: null,
      },
    },
  });

  const totalDonations = donations.reduce(
    (sum, donation) => sum + Number(donation.amount || 0),
    0
  );

  const pendingRequests = helpRequests.filter(
    (request) => request.status === "قيد المراجعة"
  );

  return {
    counts: {
      orphans: orphans.length,
      sponsors: sponsors.length,
      donations: donations.length,
      helpRequests: helpRequests.length,
      sponsoredOrphans: sponsoredCount,
      pendingHelpRequests: pendingRequests.length,
    },
    totalDonations,
    sponsorshipRate:
      orphans.length > 0 ? Math.round((sponsoredCount / orphans.length) * 100) : 0,
    recent: {
      orphans: orphans.slice(0, 4),
      donations: donations.slice(0, 4),
    },
  };
}

module.exports = {
  getDashboardSummary,
};
