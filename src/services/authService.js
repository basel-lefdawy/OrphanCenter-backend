// services/auth.service.js
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require("sequelize");
const User = require("../models/auth/user");
const RefreshToken = require("../models/auth/RefreshToken");
const { generateTokens, verifyRefreshToken } = require("../utils/jwt");
const { sendForgotPasswordEmail, sendEmailVerificationEmail } = require("../utils/email");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const saveRefreshToken = async (userId, token) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await RefreshToken.create({ userId, token, expiresAt });
};

const cleanOldTokens = async (userId) => {
    await RefreshToken.destroy({
        where: {
            userId,
            [Op.or]: [
                { expiresAt: { [Op.lt]: new Date() } },
                { isRevoked: true },
            ],
        },
    });
};

const sanitizeUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
});

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const generateTokenExpiry = (hours = 1) => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + hours);
    return expiresAt;
};

// ─── Register ─────────────────────────────────────────────────────────────────

const register = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser && existingUser.isEmailVerified) {
        throw createError("Email is already registered", 409);
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = hashToken(verificationToken);
    const verificationExpires = generateTokenExpiry(1);
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = existingUser
        ? await existingUser.update({
            name,
            password: hashedPassword,
            provider: "local",
            emailVerificationToken: verificationTokenHash,
            emailVerificationExpires: verificationExpires,
            isEmailVerified: false,
        })
        : await User.create({
            name,
            email,
            password: hashedPassword,
            emailVerificationToken: verificationTokenHash,
            emailVerificationExpires: verificationExpires,
            isEmailVerified: false,
        });

    const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    await sendEmailVerificationEmail({
        to: user.email,
        name: user.name,
        verificationUrl,
    });

    return { message: "Verification email sent. Please check your inbox to complete registration." };
};

const verifyEmail = async ({ email, token }) => {
    const tokenHash = hashToken(token);
    const user = await User.findOne({
        where: {
            email,
            emailVerificationToken: tokenHash,
            emailVerificationExpires: { [Op.gt]: new Date() },
        },
    });

    if (!user) {
        throw createError("Invalid or expired verification token", 400);
    }

    await user.update({
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
    });

    const tokens = generateTokens({ id: user.id, role: user.role });
    await saveRefreshToken(user.id, tokens.refreshToken);

    return { user: sanitizeUser(user), ...tokens };
};

// ─── Login ────────────────────────────────────────────────────────────────────

const login = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw createError("Invalid email or password", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw createError("Invalid email or password", 401);
    }

    if (!user.isEmailVerified) {
        throw createError("Email is not verified", 403);
    }

    await cleanOldTokens(user.id);
    const tokens = generateTokens({ id: user.id, role: user.role });
    await saveRefreshToken(user.id, tokens.refreshToken);

    return { user: sanitizeUser(user), ...tokens };
};

// ─── Logout ───────────────────────────────────────────────────────────────────

const logout = async (refreshToken) => {
    const tokenRecord = await RefreshToken.findOne({
        where: { token: refreshToken, isRevoked: false },
    });

    if (!tokenRecord) {
        throw createError("Invalid or already revoked token", 400);
    }

    await tokenRecord.update({ isRevoked: true });
};

// ─── Refresh access token ─────────────────────────────────────────────────────

const refresh = async (refreshToken) => {
    const { valid, decoded, error } = verifyRefreshToken(refreshToken);
    if (!valid || !decoded) {
        throw createError(error || "Invalid refresh token", 401);
    }

    const tokenRecord = await RefreshToken.findOne({
        where: { token: refreshToken, isRevoked: false },
    });
    if (!tokenRecord) {
        throw createError("Invalid or revoked refresh token", 401);
    }

    if (new Date(tokenRecord.expiresAt) < new Date()) {
        throw createError("Refresh token has expired", 401);
    }

    const user = await User.findByPk(decoded.sub);
    if (!user) {
        throw createError("User not found", 401);
    }

    await tokenRecord.update({ isRevoked: true });
    await cleanOldTokens(user.id);
    const tokens = generateTokens({ id: user.id, role: user.role });
    await saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

const forgotPassword = async (email) => {
    const user = await User.findOne({ where: { email } });

    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = hashToken(resetToken);
    const resetExpires = generateTokenExpiry(1);

    await user.update({
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: resetExpires,
    });

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    await sendForgotPasswordEmail({
        to: user.email,
        email: user.email,
        name: user.name,
        resetUrl,
    });
};

// ─── Reset Password ───────────────────────────────────────────────────────────

const resetPassword = async (email, token, newPassword) => {
    const tokenHash = hashToken(token);
    const user = await User.findOne({
        where: {
            email,
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { [Op.gt]: new Date() },
        },
    });

    if (!user) {
        throw createError("Invalid or expired reset token", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await user.update({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
    });

    await RefreshToken.update(
        { isRevoked: true },
        { where: { userId: user.id, isRevoked: false } }
    );
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
    register,
    verifyEmail,
    login,
    logout,
    refresh,
    forgotPassword,
    resetPassword,
    saveRefreshToken, // Export for social auth
};