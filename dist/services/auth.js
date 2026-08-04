"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwtToken = createJwtToken;
exports.verifyJwtToken = verifyJwtToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = '1h';
if (!jwtSecret) {
    throw new Error('Missing JWT_SECRET environment variable.');
}
const secret = jwtSecret;
function createJwtToken(user) {
    const payload = {
        sub: user.id.toString(),
        name: user.display_name,
        email: user.email,
        provider: user.provider,
    };
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: jwtExpiresIn,
    });
    return {
        token,
        expiresIn: jwtExpiresIn,
    };
}
function verifyJwtToken(token) {
    return jsonwebtoken_1.default.verify(token, secret);
}
