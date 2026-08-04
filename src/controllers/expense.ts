import { type Request, type Response } from 'express';
import * as expenseService from '../services/expense';
import { HttpError } from '../utils/httpError';

export async function listExpenses(_req: Request, res: Response) {
  const rows = await expenseService.getAllExpenses();
  res.json(rows);
}

export async function getExpense(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) throw new HttpError(400, 'Invalid id');

  const row = await expenseService.getExpenseById(id);

  if (!row) throw new HttpError(404, 'Expense not found');

  res.json(row);
}

export async function createExpense(req: Request, res: Response) {
  const { name, value, created_by } = req.body;

  if (!name || !value || !created_by) {
    throw new HttpError(400, 'Missing required fields: name, value, created_by');
  }

  const created = await expenseService.createExpense({ name, value, created_by });
  res.status(201).json(created);
}

export async function updateExpenseHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, value } = req.body;

  if (Number.isNaN(id)) throw new HttpError(400, 'Invalid id');

  const updated = await expenseService.updateExpense(id, { name, value });

  if (!updated) throw new HttpError(404, 'Expense not found');

  res.json(updated);
}

export async function deleteExpenseHandler(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) throw new HttpError(400, 'Invalid id');

  const deleted = await expenseService.deleteExpense(id);

  if (!deleted) throw new HttpError(404, 'Expense not found');

  res.status(204).send();
}

export default {
  listExpenses,
  getExpense,
  createExpense,
  updateExpenseHandler,
  deleteExpenseHandler,
};
