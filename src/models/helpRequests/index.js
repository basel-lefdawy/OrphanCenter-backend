const { sequelize } = require("../../config/db");
const HelpRequest = require("../helpRequests/helpRequests");
const Orphan = require("../orphans/orphans");
const Guardian = require("../guardian/guardian");

// Guardian 1 -> M Orphans
Guardian.hasMany(Orphan, {
  foreignKey: "GuardianID",
});

Orphan.belongsTo(Guardian, {
  foreignKey: "GuardianID",
});

// HelpRequest -> Orphan (بعد الموافقة فقط)
HelpRequest.hasOne(Orphan, {
  foreignKey: "RequestID",
});

Orphan.belongsTo(HelpRequest, {
  foreignKey: "RequestID",
});

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