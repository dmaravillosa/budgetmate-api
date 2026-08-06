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

export interface ExpenseSplitRecord {
  id: number;
  expense_id: number;
  user_id: number;
  split_value: number;
  created_at: Date;
}

export interface ExpenseRecord {
  id: number;
  name: string;
  value: number;
  calculation_type: 'equal' | 'split' | 'percentage';
  created_by: number;
  created_at: Date;
  updated_at: Date;
}
