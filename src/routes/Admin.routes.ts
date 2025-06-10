import { NextFunction, Router } from 'express';
import { Request, Response } from 'express';
import { getAllUsersForAdmin, patchUserRoleById } from '../controllers/usersController';

const router = Router();

// admin routes
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     description: Get all users, requires admin role
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminUser'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/users', getAllUsersForAdmin);

// update user role by user id
/**
 * @swagger
 * /admin/users/{id}:
 *   patch:
 *     summary: Update role of a user
 *     description: Update role of a user, requires admin role
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User role updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminUser'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch('/users/:id', patchUserRoleById );

// delete user by user id

// see how many notes a user has by user id

export default router;