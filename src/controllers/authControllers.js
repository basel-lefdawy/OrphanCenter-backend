// controllers/auth.controller.js
const authService = require("../services/authService");
const { sendSuccess } = require("../utils/apiResponse");
const { REFRESH_TOKEN_COOKIE_NAME, getRefreshTokenCookieOptions } = require("../config/cookie");

const getRefreshTokenFromRequest = (req) => {
    return req.cookies && req.cookies[REFRESH_TOKEN_COOKIE_NAME];
};

const setRefreshTokenCookie = (res, refreshToken) => {
    if (!refreshToken) return;
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, getRefreshTokenCookieOptions());
};

const clearRefreshTokenCookie = (res) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, getRefreshTokenCookieOptions());
};

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
        setRefreshTokenCookie(res, result.refreshToken);
        const responseData = {
            user: result.user,
            accessToken: result.accessToken,
        };
        return sendSuccess(res, responseData, "Email verified successfully");
    } catch (err) {
        next(err);
    }
};

// ─── Login ────────────────────────────────────────────────────────────────────

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        setRefreshTokenCookie(res, result.refreshToken);
        const responseData = {
            user: result.user,
            accessToken: result.accessToken,
        };
        return sendSuccess(res, responseData, "Logged in successfully");
    } catch (err) {
        next(err);
    }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

const logout = async (req, res, next) => {
    try {
        const refreshToken = getRefreshTokenFromRequest(req);
        await authService.logout(refreshToken);
        clearRefreshTokenCookie(res);
        return sendSuccess(res, null, "Logged out successfully");
    } catch (err) {
        next(err);
    }
};

// ─── Refresh access token ─────────────────────────────────────────────────────

const refresh = async (req, res, next) => {
    try {
        const refreshToken = getRefreshTokenFromRequest(req);
        const tokens = await authService.refresh(refreshToken);
        setRefreshTokenCookie(res, tokens.refreshToken);
        const responseData = {
            accessToken: tokens.accessToken,
        };
        return sendSuccess(res, responseData, "Tokens refreshed successfully");
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