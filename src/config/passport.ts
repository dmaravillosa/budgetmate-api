import passport from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleProfile } from '../types/auth';
import { findOrCreateGoogleUser } from '../services/user';

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;

if (!clientID || !clientSecret || !callbackURL) {
  throw new Error('Missing Google OAuth environment variables. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_CALLBACK_URL.');
}

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
      passReqToCallback: false,
    },
    async (_accessToken: string, _refreshToken: string, profile, done: VerifyCallback) => {
      const googleProfile: GoogleProfile = {
        id: profile.id,
        provider: profile.provider,
        displayName: profile.displayName,
        emails: profile.emails?.map((email) => email.value) ?? [],
        photos: profile.photos?.map((photo) => photo.value) ?? [],
      };

      try {
        const user = await findOrCreateGoogleUser(googleProfile);
        done(null, user);
      } catch (error) {
        done(error as Error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});

export default passport;
