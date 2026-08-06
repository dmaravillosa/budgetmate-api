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

const validCalculationTypes = ['equal', 'split', 'percentage'] as const;

type CalculationType = (typeof validCalculationTypes)[number];

function validateCalculationType(value: unknown): value is CalculationType {
  return typeof value === 'string' && validCalculationTypes.includes(value as CalculationType);
}

export async function createExpense(req: Request, res: Response) {
  const { name, value, created_by, calculation_type } = req.body;

  if (!name || value === undefined || !created_by) {
    throw new HttpError(400, 'Missing required fields: name, value, created_by');
  }

  if (calculation_type !== undefined && !validateCalculationType(calculation_type)) {
    throw new HttpError(400, 'Invalid calculation_type. Allowed values: equal, split, percentage');
  }

  if (typeof value !== 'number' || Number.isNaN(value) || value < 0 || !Number.isInteger(value)) {
    throw new HttpError(400, 'Invalid value; expected integer cents');
  }

  const created = await expenseService.createExpense({
    name,
    value,
    created_by,
    calculation_type,
  });
  res.status(201).json(created);
}

export async function updateExpenseHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, value, calculation_type } = req.body;

  if (Number.isNaN(id)) throw new HttpError(400, 'Invalid id');

  if (calculation_type !== undefined && !validateCalculationType(calculation_type)) {
    throw new HttpError(400, 'Invalid calculation_type. Allowed values: equal, split, percentage');
  }

  const updatePayload: Record<string, unknown> = {};
  if (name !== undefined) updatePayload.name = name;
  if (value !== undefined) {
    if (typeof value !== 'number' || Number.isNaN(value) || value < 0 || !Number.isInteger(value)) throw new HttpError(400, 'Invalid value; expected integer cents');
    updatePayload.value = value;
  }
  if (calculation_type !== undefined) updatePayload.calculation_type = calculation_type;

  const updated = await expenseService.updateExpense(id, updatePayload as any);

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

export async function listUsersForExpense(req: Request, res: Response) {
  const expenseId = Number(req.params.id);

  if (Number.isNaN(expenseId)) throw new HttpError(400, 'Invalid expense id');

  const users = await expenseService.getUsersForExpense(expenseId);
  res.json(users);
}

export async function addUserToExpense(req: Request, res: Response) {
  const expenseId = Number(req.params.id);
  const { user_id } = req.body;

  if (Number.isNaN(expenseId)) throw new HttpError(400, 'Invalid expense id');
  if (!user_id || Number.isNaN(Number(user_id))) throw new HttpError(400, 'Missing or invalid user_id');

  await expenseService.addUserToExpense(expenseId, Number(user_id));
  res.status(201).json({ expense_id: expenseId, user_id: Number(user_id) });
}

export async function removeUserFromExpense(req: Request, res: Response) {
  const expenseId = Number(req.params.id);
  const userId = Number(req.params.userId);

  if (Number.isNaN(expenseId) || Number.isNaN(userId)) throw new HttpError(400, 'Invalid expense id or user id');

  const deleted = await expenseService.removeUserFromExpense(expenseId, userId);

  if (!deleted) throw new HttpError(404, 'Expense-user association not found');

  res.status(204).send();
}

export async function calculateExpenseSplits(req: Request, res: Response) {
  const expenseId = Number(req.params.id);

  if (Number.isNaN(expenseId)) throw new HttpError(400, 'Invalid id');

  const expense = await expenseService.getExpenseById(expenseId);

  if (!expense) throw new HttpError(404, 'Expense not found');

  const users = await expenseService.getUsersForExpense(expenseId);

  if (!users.length) throw new HttpError(400, 'No users associated with this expense');

  if (typeof expense.value !== 'number') throw new HttpError(500, 'Expense value is missing');
  const totalCents = Math.round(expense.value);
  if (Number.isNaN(totalCents) || totalCents < 0) throw new HttpError(400, 'Invalid expense value');
  let splits: Array<{ user_id: number; split_value: number }> = [];

  if (expense.calculation_type === 'percentage') {
    const { percentages } = req.body;

    if (!Array.isArray(percentages) || percentages.length === 0) {
      throw new HttpError(400, 'Percentages are required for percentage calculation type');
    }

    const memberIds = new Set(users.map((user) => user.id));
    const percentageMap = new Map<number, number>();
    let totalPercent = 0;

    for (const item of percentages) {
      if (
        !item ||
        typeof item.user_id !== 'number' ||
        Number.isNaN(item.user_id) ||
        typeof item.percentage !== 'number' ||
        Number.isNaN(item.percentage) ||
        item.percentage < 0
      ) {
        throw new HttpError(400, 'Invalid percentage input');
      }

      if (!memberIds.has(item.user_id)) {
        throw new HttpError(400, 'Percentage data must match expense members');
      }

      if (percentageMap.has(item.user_id)) {
        throw new HttpError(400, 'Duplicate percentage entry for a user');
      }

      percentageMap.set(item.user_id, item.percentage);
      totalPercent += item.percentage;
    }

    if (percentageMap.size !== users.length) {
      throw new HttpError(400, 'Percentage values must be provided for every expense member');
    }

    if (Math.abs(totalPercent - 100) > 0.01) {
      throw new HttpError(400, 'Percentages must sum to 100');
    }

    let remainingCents = totalCents;

    splits = users.map((user, index) => {
      const percent = percentageMap.get(user.id) ?? 0;
      const cents = index === users.length - 1
        ? remainingCents
        : Math.round((totalCents * percent) / 100);

      if (index !== users.length - 1) {
        remainingCents -= cents;
      }

      return {
        user_id: user.id,
        split_value: cents,
      };
    });
  } else if (expense.calculation_type === 'split') {
    const { values } = req.body;

    if (values !== undefined && !Array.isArray(values)) {
      throw new HttpError(400, 'Values must be an array for split calculation type');
    }

    const memberIds = new Set(users.map((user) => user.id));
    const providedMap = new Map<number, number>();
    let providedCents = 0;

    if (Array.isArray(values)) {
      for (const item of values) {
        if (
          !item ||
          typeof item.user_id !== 'number' ||
          Number.isNaN(item.user_id) ||
          typeof item.value !== 'number' ||
          Number.isNaN(item.value) ||
          item.value < 0 ||
          !Number.isInteger(item.value)
        ) {
          throw new HttpError(400, 'Invalid split value input; expected integer cents');
        }

        if (!memberIds.has(item.user_id)) {
          throw new HttpError(400, 'Split values must match expense members');
        }

        if (providedMap.has(item.user_id)) {
          throw new HttpError(400, 'Duplicate split value entry for a user');
        }

        const cents = Math.round(item.value);
        providedMap.set(item.user_id, cents);
        providedCents += cents;
      }
    }

    if (providedCents > totalCents) {
      throw new HttpError(400, 'Provided split values exceed total expense value');
    }

    const unassignedUsers = users.filter((user) => !providedMap.has(user.id));
    const remainingCents = totalCents - providedCents;

    if (unassignedUsers.length === 0 && remainingCents !== 0) {
      throw new HttpError(400, 'Provided split values must sum to the total expense value');
    }

    const baseCents = unassignedUsers.length > 0 ? Math.floor(remainingCents / unassignedUsers.length) : 0;
    let remainder = unassignedUsers.length > 0 ? remainingCents - baseCents * unassignedUsers.length : 0;

    splits = users.map((user) => {
      if (providedMap.has(user.id)) {
        return {
          user_id: user.id,
          split_value: providedMap.get(user.id)!,
        };
      }

      const cents = remainder > 0 ? baseCents + 1 : baseCents;
      if (remainder > 0) remainder -= 1;
      return {
        user_id: user.id,
        split_value: cents,
      };
    });
  } else {
    const count = users.length;
    const baseCents = Math.floor(totalCents / count);
    const remainder = totalCents - baseCents * count;

    splits = users.map((user, index) => {
      const cents = index === count - 1 ? baseCents + remainder : baseCents;
      return {
        user_id: user.id,
        split_value: cents,
      };
    });
  }

  await expenseService.setExpenseSplits(expenseId, splits as any);
  const storedSplits = await expenseService.getExpenseSplits(expenseId);
  res.json(storedSplits);
}

export default {
  listExpenses,
  getExpense,
  createExpense,
  updateExpenseHandler,
  deleteExpenseHandler,
  listUsersForExpense,
  addUserToExpense,
  removeUserFromExpense,
  calculateExpenseSplits,
};