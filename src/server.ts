import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import passport from 'passport';
import router from './routes/index';
import db from './config/db';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(passport.initialize());
app.use('/', router);

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await db.raw('SELECT 1+1 AS result');
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', db: 'unavailable', details: error instanceof Error ? error.message : String(error) });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
