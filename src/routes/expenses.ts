import { Router } from 'express';
import * as expenseCtrl from '../controllers/expense';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(expenseCtrl.listExpenses));
router.get('/:id', asyncHandler(expenseCtrl.getExpense));
router.post('/', asyncHandler(expenseCtrl.createExpense));
router.put('/:id', asyncHandler(expenseCtrl.updateExpenseHandler));
router.delete('/:id', asyncHandler(expenseCtrl.deleteExpenseHandler));

export default router;
