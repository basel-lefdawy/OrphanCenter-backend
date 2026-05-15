require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./config/db");
const seedDevAdmin = require("./utils/seedDevAdmin");

require("./models/orphans/orphans");
require("./models/guardian/guardian");
require("./models/helpRequests/helpRequests");
require("./models/donations/donations");
require("./models/sponsors/sponsors");
require("./models/sponsorShip/sponsorShip");
require("./models/auth/user");
require("./models/auth/RefreshToken");

require("./models");
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected and synced");

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
