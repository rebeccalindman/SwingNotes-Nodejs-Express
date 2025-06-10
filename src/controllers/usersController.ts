// /controllers/usersController.ts
import { Request, Response, NextFunction } from "express";
import { fetchAllUsers } from "../services/userService";
import { createError } from "../utils/createError";
import { HTTP_STATUS } from "../constants/httpStatus";

// todo controllers for:
// GET /users/:id
// PUT /users/:id
// DELETE /users/:id
// GET /users

export const getAllUsersForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await fetchAllUsers();
        const countOfUsers = users.length;
        res.status(HTTP_STATUS.OK).json({ countOfUsers: countOfUsers, users: users });
    } catch (err) {
        console.error("Error fetching users:", err);
        next(createError("Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}



//Helper Functions

// todo Check if user exists
// PublicUser type
