const { sequelize } = require("../../config/db");

const HelpRequest = require("../helpRequests/helpRequests");
const Orphan = require("../orphans/orphans");
const Guardian = require("../guardian/guardian");
const User = require("../auth/user");

// Guardian 1 -> Many Orphans
Guardian.hasMany(Orphan, {
  foreignKey: "GuardianID",
});

Orphan.belongsTo(Guardian, {
  foreignKey: "GuardianID",
});

// Orphan 1 -> Many HelpRequests
Orphan.hasMany(HelpRequest, {
  foreignKey: "OrphanID",
});

HelpRequest.belongsTo(Orphan, {
  foreignKey: "OrphanID",
});

User.hasMany(HelpRequest, {
  foreignKey: "userId",
});

HelpRequest.belongsTo(User, {
  foreignKey: "userId",
});

// sync DB
const syncDB = async () => {
  await sequelize.sync({ alter: true });
  console.log("DB Synced");
};

module.exports = {
  sequelize,
  HelpRequest,
  Orphan,
  Guardian,
  syncDB,
};