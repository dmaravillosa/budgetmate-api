export interface GoogleProfile {
  id: string;
  provider: string;
  displayName: string;
  emails: string[];
  photos: string[];
}

export interface AuthUser {
  id: number;
  google_id: string;
  email: string;
  display_name: string;
  provider: string;
  avatar_url?: string | null;
}

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  provider: string;
  iat?: number;
  exp?: number;
}
