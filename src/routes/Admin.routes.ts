import { NextFunction, Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// admin routes
router.get('/users', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: 'Get all users' });
});

// update user role by user id

// delete user by user id

// see how many notes a user has by user id

export default router;