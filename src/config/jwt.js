const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined in environment variables");
    return secret;
};

const getRefreshSecret = () => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
    return secret;
};

const jwtConfig = {
    access: {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        algorithm: "HS256",
    },
    refresh: {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        algorithm: "HS256",
    },
};

module.exports = { getSecret, getRefreshSecret, jwtConfig };