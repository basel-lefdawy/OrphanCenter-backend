const { sequelize } = require("../config/db");

const defineSponsor = require("./sponsors/sponsors");
const defineSponsorship = require("./sponsorShip/sponsorShip");
const defineOrphan = require("./orphans/orphans");
const defineSponsorshipRequest = require("./sponsorshipRequest/sponsorshipRequest");

const SponsorshipRequest = defineSponsorshipRequest(sequelize);
const Sponsor = defineSponsor(sequelize);
const Sponsorship = defineSponsorship(sequelize);
const Orphan = defineOrphan(sequelize);

const models = { sequelize, Sponsor, Sponsorship, Orphan,SponsorshipRequest };

if (typeof Sponsor.associate === "function") {
  Sponsor.associate(models);
}
if (typeof Sponsorship.associate === "function") {
  Sponsorship.associate(models);
}
  if (typeof SponsorshipRequest.associate === "function") {
  SponsorshipRequest.associate(models);
} 

module.exports = models;
