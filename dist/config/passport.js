"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_1 = require("../services/user");
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;
if (!clientID || !clientSecret || !callbackURL) {
    throw new Error('Missing Google OAuth environment variables. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_CALLBACK_URL.');
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID,
    clientSecret,
    callbackURL,
    passReqToCallback: false,
}, async (_accessToken, _refreshToken, profile, done) => {
    const googleProfile = {
        id: profile.id,
        provider: profile.provider,
        displayName: profile.displayName,
        emails: profile.emails?.map((email) => email.value) ?? [],
        photos: profile.photos?.map((photo) => photo.value) ?? [],
    };
    try {
        const user = await (0, user_1.findOrCreateGoogleUser)(googleProfile);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
exports.default = passport_1.default;
