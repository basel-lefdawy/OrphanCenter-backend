const jwt = require("jsonwebtoken");
const { getSecret, getRefreshSecret, jwtConfig } = require("../../config/jwt");

const generateAccessToken = (user) => {
    return jwt.sign(
        { sub: user.id, role: user.role, type: "access" },
        getSecret(),
        jwtConfig.access
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { sub: user.id, type: "refresh" },
        getRefreshSecret(),
        jwtConfig.refresh
    );
};

const generateTokens = (user) => ({
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
});

module.exports = { generateAccessToken, generateRefreshToken, generateTokens };