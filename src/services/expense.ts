import db from '../config/db';
import { ExpenseRecord, ExpenseSplitRecord, UserRecord } from '../types/db';

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

export async function getExpenseSplits(expenseId: number): Promise<ExpenseSplitRecord[]> {
  return db<ExpenseSplitRecord>('expense_splits')
    .where({ expense_id: expenseId })
    .orderBy('user_id', 'asc');
}

export async function setExpenseSplits(expenseId: number, splits: Array<{ user_id: number; split_value: number }>): Promise<void> {
  await db.transaction(async (trx) => {
    await trx('expense_splits').where({ expense_id: expenseId }).del();
    const insertRows = splits.map((split) => ({
      expense_id: expenseId,
      user_id: split.user_id,
      split_value: split.split_value,
    }));
    await trx('expense_splits').insert(insertRows);
  });
}

export async function createExpense(data: Partial<ExpenseRecord>): Promise<ExpenseRecord> {
  const insertData: Partial<ExpenseRecord> = {
    name: data.name,
    value: data.value ?? 0,
    created_by: data.created_by,
  };

  if (data.calculation_type !== undefined) {
    insertData.calculation_type = data.calculation_type;
  }

  const [insertId] = await db('expenses').insert(insertData);

  const id = typeof insertId === 'number' ? insertId : Number(insertId);
  const row = await getExpenseById(id);

  if (!row) throw new Error('Failed to load expense after insert');

  return row;
}

export async function updateExpense(id: number, data: Partial<ExpenseRecord>): Promise<ExpenseRecord | undefined> {
  const updateData: Record<string, unknown> = {
    updated_at: db.fn.now(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.value !== undefined) updateData.value = data.value;
  if (data.calculation_type !== undefined) updateData.calculation_type = data.calculation_type;

  await db('expenses').where({ id }).update(updateData);

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
  getExpenseSplits,
  setExpenseSplits,
  createExpense,
  updateExpense,
  deleteExpense,
};
