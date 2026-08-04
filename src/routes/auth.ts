import { Router, type Request, type Response } from 'express';
import passport from '../config/passport';
import { createJwtToken } from '../services/auth';
import { AuthUser } from '../types/auth';

const router = Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }),
  (req: Request, res: Response) => {
    const user = req.user as AuthUser;

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const tokenData = createJwtToken(user);

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
  }
);

router.get('/google/failure', (_req: Request, res: Response) => {
  res.status(401).json({ error: 'Google authentication failed' });
});

export default router;
