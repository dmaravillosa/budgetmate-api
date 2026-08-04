import jwt from 'jsonwebtoken';
import { AuthUser, JwtPayload } from '../types/auth';

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = '1h';

if (!jwtSecret) {
  throw new Error('Missing JWT_SECRET environment variable.');
}

const secret = jwtSecret;

export function createJwtToken(user: AuthUser) {
  const payload: JwtPayload = {
    sub: user.id.toString(),
    name: user.display_name,
    email: user.email,
    provider: user.provider,
  };

  const token = jwt.sign(payload, secret, {
    expiresIn: jwtExpiresIn,
  });

  return {
    token,
    expiresIn: jwtExpiresIn,
  };
}

export function verifyJwtToken(token: string) {
  return jwt.verify(token, secret) as JwtPayload;
}
