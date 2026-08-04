"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const index_1 = __importDefault(require("./routes/index"));
const db_1 = __importDefault(require("./config/db"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use('/', index_1.default);
app.get('/health', async (_req, res) => {
    try {
        await db_1.default.raw('SELECT 1+1 AS result');
        res.status(200).json({ status: 'ok', db: 'connected' });
    }
    catch (error) {
        res.status(503).json({ status: 'error', db: 'unavailable', details: error instanceof Error ? error.message : String(error) });
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
