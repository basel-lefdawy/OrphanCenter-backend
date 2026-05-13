// controllers/auth.controller.js
const authService = require("../services/authService");
const { sendSuccess } = require("../utils/apiResponse");

// ─── Register ─────────────────────────────────────────────────────────────────

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        return sendSuccess(res, result, "Verification email sent. Please verify your email before logging in.", 201);
    } catch (err) {
        next(err);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const result = await authService.verifyEmail(req.body);
        return sendSuccess(res, result, "Email verified successfully");
    } catch (err) {
        next(err);
    }
};

// ─── Login ────────────────────────────────────────────────────────────────────

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        return sendSuccess(res, result, "Logged in successfully");
    } catch (err) {
        next(err);
    }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

const logout = async (req, res, next) => {
    try {
        await authService.logout(req.body.refreshToken);
        return sendSuccess(res, null, "Logged out successfully");
    } catch (err) {
        next(err);
    }
};

// ─── Refresh access token ─────────────────────────────────────────────────────

const refresh = async (req, res, next) => {
    try {
        const tokens = await authService.refresh(req.body.refreshToken);
        return sendSuccess(res, tokens, "Tokens refreshed successfully");
    } catch (err) {
        next(err);
    }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

const forgotPassword = async (req, res, next) => {
    try {
        await authService.forgotPassword(req.body.email);

        // Always same response — whether email exists or not
        // prevents user enumeration attacks
        return sendSuccess(res, null, "If this email is registered, you will hear from us shortly");
    } catch (err) {
        next(err);
    }
};

// ─── Reset Password ───────────────────────────────────────────────────────────

const resetPassword = async (req, res, next) => {
    try {
        await authService.resetPassword(req.body.email, req.body.token, req.body.password);
        return sendSuccess(res, null, "Password reset successfully");
    } catch (err) {
        next(err);
    }
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
};