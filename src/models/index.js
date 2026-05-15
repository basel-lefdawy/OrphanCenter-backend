const { sequelize } = require("../config/db");

const defineSponsor = require("./sponsors/sponsors");
const defineSponsorship = require("./sponsorShip/sponsorShip");
const defineOrphan = require("./orphans/orphans");
const defineSponsorshipRequest = require("./SponsorShipRequest/SponsorShipRequest");
const defineRepresentative = require("./Representative/Representative");

const SponsorshipRequest = defineSponsorshipRequest(sequelize);
const Sponsor = defineSponsor(sequelize);
const Sponsorship = defineSponsorship(sequelize);
const Orphan = defineOrphan(sequelize);
const Representative = defineRepresentative(sequelize);

const HelpRequest = require("./helpRequests/helpRequests");
const Guardian = require("./guardian/guardian");

const models = {
  sequelize,
  Sponsor,
  Sponsorship,
  Orphan,
  SponsorshipRequest,
  Representative,
  HelpRequest,
  Guardian,
};

if (typeof Sponsor.associate === "function") {
  Sponsor.associate(models);
}
if (typeof Sponsorship.associate === "function") {
  Sponsorship.associate(models);
}
if (typeof SponsorshipRequest.associate === "function") {
  SponsorshipRequest.associate(models);
}
if (typeof Representative.associate === "function") {
  Representative.associate(models);
}

module.exports = models;
