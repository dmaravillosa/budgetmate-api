import db from '../config/db';
import { ExpenseRecord } from '../types/db';
import { UserRecord } from '../types/db';

export async function getAllExpenses(): Promise<ExpenseRecord[]> {
  return db<ExpenseRecord>('expenses').select('*').orderBy('id', 'asc');
}

export async function getExpenseById(id: number): Promise<ExpenseRecord | undefined> {
  return db<ExpenseRecord>('expenses').where({ id }).first();
}

export async function getUsersForExpense(expenseId: number): Promise<UserRecord[]> {
  return db<UserRecord>('users')
    .join('expense_users', 'users.id', 'expense_users.user_id')
    .where('expense_users.expense_id', expenseId)
    .select('users.*');
}

export async function addUserToExpense(expenseId: number, userId: number): Promise<void> {
  await db('expense_users').insert({
    expense_id: expenseId,
    user_id: userId,
  });
}

export async function removeUserFromExpense(expenseId: number, userId: number): Promise<number> {
  return db('expense_users').where({ expense_id: expenseId, user_id: userId }).del();
}

export async function createExpense(data: Partial<ExpenseRecord>): Promise<ExpenseRecord> {
  const [insertId] = await db('expenses').insert({
    name: data.name,
    value: data.value,
    created_by: data.created_by,
  });

  const id = typeof insertId === 'number' ? insertId : Number(insertId);
  const row = await getExpenseById(id);

  if (!row) throw new Error('Failed to load expense after insert');

  return row;
}

export async function updateExpense(id: number, data: Partial<ExpenseRecord>): Promise<ExpenseRecord | undefined> {
  await db('expenses').where({ id }).update({
    name: data.name,
    value: data.value,
    updated_at: db.fn.now(),
  });

  return getExpenseById(id);
}

export async function deleteExpense(id: number): Promise<number> {
  return db('expenses').where({ id }).del();
}

export default {
  getAllExpenses,
  getExpenseById,
  getUsersForExpense,
  addUserToExpense,
  removeUserFromExpense,
  createExpense,
  updateExpense,
  deleteExpense,
};
