const jwt = require("jsonwebtoken");
const { getSecret, getRefreshSecret } = require("../../config/jwt");

const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, getSecret());
        if (decoded.type !== "access") throw new Error("Invalid token type");
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, error: err.message };
    }
};

const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, getRefreshSecret());
        if (decoded.type !== "refresh") throw new Error("Invalid token type");
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, error: err.message };
    }
};

module.exports = { verifyAccessToken, verifyRefreshToken };