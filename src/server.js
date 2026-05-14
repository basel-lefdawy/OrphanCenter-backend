require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./config/db");
const seedDevAdmin = require("./utils/seedDevAdmin");

require("./models/orphans/orphans");
require("./models/guardian/guardian");
require("./models/helpRequests/helpRequests");
require("./models/donations/donations");
require("./models/sponsors/sponsors");
require("./models/sponsorShip/sponsorShip");
require("./models/auth/user");
require("./models/auth/RefreshToken");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Database synced");

    if (process.env.NODE_ENV !== "production") {
      await seedDevAdmin();
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err);
  }
};

startServer();
