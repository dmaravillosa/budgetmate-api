import { Router } from 'express';
import * as expenseCtrl from '../controllers/expense';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(expenseCtrl.listExpenses));
router.get('/:id', asyncHandler(expenseCtrl.getExpense));
router.post('/', asyncHandler(expenseCtrl.createExpense));
router.put('/:id', asyncHandler(expenseCtrl.updateExpenseHandler));
router.delete('/:id', asyncHandler(expenseCtrl.deleteExpenseHandler));

router.get('/:id/users', asyncHandler(expenseCtrl.listUsersForExpense));
router.post('/:id/users', asyncHandler(expenseCtrl.addUserToExpense));
router.delete('/:id/users/:userId', asyncHandler(expenseCtrl.removeUserFromExpense));

export default router;
