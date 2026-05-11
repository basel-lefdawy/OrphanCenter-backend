const crypto = require("crypto");

const SECRET_KEY = process.env.SECRET_KEY || "12345678901234567890123456789012"; 
// لازم 32 char

const IV = Buffer.alloc(16, 0);

// ENCRYPT
function encrypt(text) {
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), IV);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
}

// DECRYPT
function decrypt(text) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), IV);

  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encrypt, decrypt };