import { Router, type Request, type Response } from 'express';
import authRouter from './auth';
import expensesRouter from './expenses';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'API ready' });
});

router.use('/auth', authRouter);
router.use('/expenses', expensesRouter);

export default router;
