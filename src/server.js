require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./config/db");

require("./models/orphans/orphans");
require("./models/sponsors/sponsors");
require("./models/sponsorShip/sponsorShip");
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // اتصال بالداتابيس
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // إنشاء الجداول (أو تعديلها)
    await sequelize.sync();
    console.log("✅ Database synced");

    // تشغيل السيرفر
    app.listen(PORT, () => {
      console.log('🚀 Server is running on port ${PORT}');
    });

  } catch (err) {
    console.error("❌ Server startup error:", err);
  }
};

startServer();