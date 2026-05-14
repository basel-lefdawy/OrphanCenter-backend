const bcrypt = require("bcrypt");
const User = require("../models/auth/user");

const DEV_ADMIN_EMAIL = "admin@gmail.com";
const DEV_ADMIN_PASSWORD = "admin123";

async function seedDevAdmin() {
  const existingAdmin = await User.findOne({
    where: { email: DEV_ADMIN_EMAIL },
  });

  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(DEV_ADMIN_PASSWORD, 12);

  await User.create({
    name: "Admin",
    email: DEV_ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
    provider: "local",
    isEmailVerified: true,
  });

  console.log("Development admin account created.");
}

module.exports = seedDevAdmin;
