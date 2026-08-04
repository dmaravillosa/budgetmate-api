export interface ExpenseUserRecord {
  id: number;
  expense_id: number;
  user_id: number;
  created_at: Date;
}

export interface ExpenseWithUsers {
  id: number;
  name: string;
  value: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  users?: Array<{
    id: number;
    google_id: string;
    email: string;
    display_name: string;
    provider: string;
    avatar_url?: string | null;
    created_at: Date;
    updated_at: Date;
  }>;
}
