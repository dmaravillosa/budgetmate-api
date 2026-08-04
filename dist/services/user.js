"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByGoogleId = findUserByGoogleId;
exports.findUserByEmail = findUserByEmail;
exports.createUserFromGoogle = createUserFromGoogle;
exports.findOrCreateGoogleUser = findOrCreateGoogleUser;
const db_1 = __importDefault(require("../config/db"));
async function findUserByGoogleId(googleId) {
    return (0, db_1.default)('users').where({ google_id: googleId }).first();
}
async function findUserByEmail(email) {
    return (0, db_1.default)('users').where({ email }).first();
}
async function createUserFromGoogle(profile) {
    const email = profile.emails[0] ?? '';
    if (!email) {
        throw new Error('Google profile did not provide an email address.');
    }
    return db_1.default.transaction(async (trx) => {
        const [insertId] = await trx('users').insert({
            google_id: profile.id,
            email,
            display_name: profile.displayName,
            provider: profile.provider,
            avatar_url: profile.photos[0] ?? null,
        });
        const id = typeof insertId === 'number' ? insertId : Number(insertId);
        const user = await trx('users').where({ id }).first();
        if (!user) {
            throw new Error('Unable to load user after creation');
        }
        return user;
    });
}
async function findOrCreateGoogleUser(profile) {
    const email = profile.emails[0] ?? '';
    if (!email) {
        throw new Error('Google profile did not provide an email address.');
    }
    return db_1.default.transaction(async (trx) => {
        let user = await trx('users').where({ google_id: profile.id }).first();
        if (user) {
            await trx('users')
                .where({ id: user.id })
                .update({
                email,
                display_name: profile.displayName,
                provider: profile.provider,
                avatar_url: profile.photos[0] ?? null,
                updated_at: trx.fn.now(),
            });
            return { ...user, email, display_name: profile.displayName, provider: profile.provider, avatar_url: profile.photos[0] ?? null };
        }
        user = await trx('users').where({ email }).first();
        if (user) {
            const [updatedUser] = await trx('users')
                .where({ id: user.id })
                .update({
                google_id: profile.id,
                display_name: profile.displayName,
                provider: profile.provider,
                avatar_url: profile.photos[0] ?? null,
                updated_at: trx.fn.now(),
            })
                .returning(['id', 'google_id', 'email', 'display_name', 'provider', 'avatar_url', 'created_at', 'updated_at']);
            return updatedUser ?? user;
        }
        const [insertId] = await trx('users').insert({
            google_id: profile.id,
            email,
            display_name: profile.displayName,
            provider: profile.provider,
            avatar_url: profile.photos[0] ?? null,
        });
        const id = typeof insertId === 'number' ? insertId : Number(insertId);
        const newUser = await trx('users').where({ id }).first();
        if (!newUser) {
            throw new Error('Unable to load user after creation');
        }
        return newUser;
    });
}
