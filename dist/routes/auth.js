"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("../config/passport"));
const auth_1 = require("../services/auth");
const router = (0, express_1.Router)();
router.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
}));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }), (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
    const tokenData = (0, auth_1.createJwtToken)(user);
    res.status(200).json({
        user: {
            id: user.id,
            googleId: user.google_id,
            email: user.email,
            displayName: user.display_name,
            provider: user.provider,
            avatarUrl: user.avatar_url,
        },
        token: tokenData.token,
        expiresIn: tokenData.expiresIn,
    });
});
router.get('/google/failure', (_req, res) => {
    res.status(401).json({ error: 'Google authentication failed' });
});
exports.default = router;
