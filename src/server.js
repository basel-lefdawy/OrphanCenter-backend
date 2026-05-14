require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./config/db");

require("./models/orphans/orphans");
require("./models/guardian/guardian");
require("./models/helpRequests/helpRequests");
require("./models/donations/donations");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Database synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err);
  }
};

startServer();