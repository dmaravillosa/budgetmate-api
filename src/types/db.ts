import type { Knex } from 'knex';

export interface UserRecord {
  id: number;
  google_id: string;
  email: string;
  display_name: string;
  provider: string;
  avatar_url?: string | null;
  created_at: Date;
  updated_at: Date;
}

export type Db = Knex;
