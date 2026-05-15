const { HelpRequest } = require("../models/helpRequests");
const { SponsorshipRequest } = require("../models/SponsorShipRequest");

const getMyRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const helpRequests = await HelpRequest.findAll({
            where: { userId },
        });

        const sponsorshipRequests = await SponsorshipRequest.findAll({
            where: { userId },
        });

        return res.json({
            helpRequests,
            sponsorshipRequests,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};