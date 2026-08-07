import { Router, type Request, type Response } from 'express';
import passport from '../config/passport';
import { createJwtToken } from '../services/auth';
import { AuthUser } from '../types/auth';

const router = Router();
const frontendRedirectUrl = process.env.FRONTEND_REDIRECT_URL || 'http://localhost:8000/dashboard';

/**
 * @openapi
 * /auth/google:
 *   get:
 *     summary: Start Google OAuth login
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Authenticated user with JWT token
 *       401:
 *         description: Authentication failed
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }),
  (req: Request, res: Response) => {
    const user = req.user as AuthUser;

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const tokenData = createJwtToken(user);
    const dashboardUrl = new URL(frontendRedirectUrl);
    dashboardUrl.searchParams.set('token', tokenData.token);

    return res.redirect(dashboardUrl.toString());
  }
);

router.get('/google/failure', (_req: Request, res: Response) => {
  res.status(401).json({ error: 'Google authentication failed' });
});

router.post('/logout', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
