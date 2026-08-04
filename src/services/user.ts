import db from '../config/db';
import { UserRecord } from '../types/db';
import { GoogleProfile } from '../types/auth';

export async function findUserByGoogleId(googleId: string): Promise<UserRecord | undefined> {
  return db<UserRecord>('users').where({ google_id: googleId }).first();
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  return db<UserRecord>('users').where({ email }).first();
}

export async function createUserFromGoogle(profile: GoogleProfile): Promise<UserRecord> {
  const email = profile.emails[0] ?? '';

  if (!email) {
    throw new Error('Google profile did not provide an email address.');
  }

  return db.transaction(async (trx) => {
    const [insertId] = await trx('users').insert({
      google_id: profile.id,
      email,
      display_name: profile.displayName,
      provider: profile.provider,
      avatar_url: profile.photos[0] ?? null,
    });

    const id = typeof insertId === 'number' ? insertId : Number(insertId);
    const user = await trx<UserRecord>('users').where({ id }).first();

    if (!user) {
      throw new Error('Unable to load user after creation');
    }

    return user;
  });
}

export async function findOrCreateGoogleUser(profile: GoogleProfile): Promise<UserRecord> {
  const email = profile.emails[0] ?? '';

  if (!email) {
    throw new Error('Google profile did not provide an email address.');
  }

  return db.transaction(async (trx) => {
    let user = await trx<UserRecord>('users').where({ google_id: profile.id }).first();

    if (user) {
      await trx<UserRecord>('users')
        .where({ id: user.id })
        .update({
          email,
          display_name: profile.displayName,
          provider: profile.provider,
          avatar_url: profile.photos[0] ?? null,
          updated_at: trx.fn.now(),
        });

      return { ...user, email, display_name: profile.displayName, provider: profile.provider, avatar_url: profile.photos[0] ?? null };
    }

    user = await trx<UserRecord>('users').where({ email }).first();

    if (user) {
      const [updatedUser] = await trx<UserRecord>('users')
        .where({ id: user.id })
        .update({
          google_id: profile.id,
          display_name: profile.displayName,
          provider: profile.provider,
          avatar_url: profile.photos[0] ?? null,
          updated_at: trx.fn.now(),
        })
        .returning(['id', 'google_id', 'email', 'display_name', 'provider', 'avatar_url', 'created_at', 'updated_at']);

      return updatedUser ?? user;
    }

    const [insertId] = await trx('users').insert({
      google_id: profile.id,
      email,
      display_name: profile.displayName,
      provider: profile.provider,
      avatar_url: profile.photos[0] ?? null,
    });

    const id = typeof insertId === 'number' ? insertId : Number(insertId);
    const newUser = await trx<UserRecord>('users').where({ id }).first();

    if (!newUser) {
      throw new Error('Unable to load user after creation');
    }

    return newUser;
  });
}
