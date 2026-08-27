import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import router from './routes/index';
import swaggerSpec from './openapi';
import db from './config/db';
import { authenticateToken, isPublicRoute } from './middlewares/auth';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(passport.initialize());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/openapi.json', (_req: Request, res: Response) => res.json(swaggerSpec));
app.use((req, res, next) => {
  if (isPublicRoute(req.path)) {
    return next();
  }

  return authenticateToken(req, res, next);
});
app.use('/', router);

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await db.raw('SELECT 1+1 AS result');
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', db: 'unavailable', details: error instanceof Error ? error.message : String(error) });
  }
});

// centralized error handler
app.use((err: unknown, _req: Request, res: Response, _next: any) => {
  /* eslint-disable no-console */
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  /* eslint-enable no-console */

  if (err && typeof (err as any).status === 'number') {
    const e = err as any;
    return res.status(e.status).json({ error: e.message });
  }

  res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
