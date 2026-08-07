import { type NextFunction, type Request, type Response } from 'express';
import { verifyJwtToken } from '../services/auth';

export function isPublicRoute(path: string) {
  return ['/', '/health', '/docs', '/openapi.json'].includes(path) || path.startsWith('/auth');
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const tokenFromQuery = typeof req.query.token === 'string' ? req.query.token : undefined;
  const token = tokenFromHeader ?? tokenFromQuery;

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    const payload = verifyJwtToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
