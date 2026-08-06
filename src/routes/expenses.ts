import { Router } from 'express';
import * as expenseCtrl from '../controllers/expense';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

/**
 * @openapi
 * /expenses:
 *   get:
 *     summary: List all expenses
 *     tags:
 *       - Expenses
 *     responses:
 *       200:
 *         description: A list of expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 */
router.get('/', asyncHandler(expenseCtrl.listExpenses));

/**
 * @openapi
 * /expenses/{id}:
 *   get:
 *     summary: Get an expense by id
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Expense not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', asyncHandler(expenseCtrl.getExpense));

/**
 * @openapi
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     tags:
 *       - Expenses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseCreate'
 *     responses:
 *       201:
 *         description: Created expense
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 */
router.post('/', asyncHandler(expenseCtrl.createExpense));

/**
 * @openapi
 * /expenses/{id}:
 *   put:
 *     summary: Update an existing expense
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated expense
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 */
router.put('/:id', asyncHandler(expenseCtrl.updateExpenseHandler));

/**
 * @openapi
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Expense deleted
 */
router.delete('/:id', asyncHandler(expenseCtrl.deleteExpenseHandler));

/**
 * @openapi
 * /expenses/{id}/users:
 *   get:
 *     summary: List users associated with an expense
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Users associated with expense
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   google_id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   display_name:
 *                     type: string
 *                   provider:
 *                     type: string
 *                   avatar_url:
 *                     type: string
 */
router.get('/:id/users', asyncHandler(expenseCtrl.listUsersForExpense));

/**
 * @openapi
 * /expenses/{id}/users:
 *   post:
 *     summary: Associate a user with an expense
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *             required:
 *               - user_id
 *     responses:
 *       201:
 *         description: Expense-user association created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseUser'
 */
router.post('/:id/users', asyncHandler(expenseCtrl.addUserToExpense));

/**
 * @openapi
 * /expenses/{id}/users/{userId}:
 *   delete:
 *     summary: Remove a user from an expense
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Association removed
 */
router.delete('/:id/users/:userId', asyncHandler(expenseCtrl.removeUserFromExpense));

export default router;
