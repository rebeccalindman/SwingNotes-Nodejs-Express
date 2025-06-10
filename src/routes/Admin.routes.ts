import { NextFunction, Router } from 'express';
import { Request, Response } from 'express';
import { getAllUsersForAdmin } from '../controllers/usersController';

const router = Router();

// admin routes
router.get('/users', getAllUsersForAdmin);

// update user role by user id

// delete user by user id

// see how many notes a user has by user id

export default router;