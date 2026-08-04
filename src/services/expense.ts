import db from '../config/db';
import { ExpenseRecord } from '../types/db';

export async function getAllExpenses(): Promise<ExpenseRecord[]> {
  return db<ExpenseRecord>('expenses').select('*').orderBy('id', 'asc');
}

export async function getExpenseById(id: number): Promise<ExpenseRecord | undefined> {
  return db<ExpenseRecord>('expenses').where({ id }).first();
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
  createExpense,
  updateExpense,
  deleteExpense,
};
