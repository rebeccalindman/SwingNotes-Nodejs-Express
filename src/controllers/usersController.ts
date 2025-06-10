// /controllers/usersController.ts
import { Request, Response, NextFunction } from "express";
import { fetchAllUsers, updateRoleOfUser, findUserById } from "../services/userService";
import { createError } from "../utils/createError";
import { HTTP_STATUS } from "../constants/httpStatus";


/** *
 * * Admin only functions
 */
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

export const patchUserRoleById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const role = req.body.role;
    const validRoles = ["user", "admin"];

    if (role && !validRoles.includes(role)) {
        return next(createError(`Invalid role, should be one of [${validRoles}]`, HTTP_STATUS.BAD_REQUEST));
    }

    try {
        await updateRoleOfUser(userId, role);
        const updatedUser = await findUserById(userId); 
        
        res.status(HTTP_STATUS.OK).json({ message: "User role updated successfully", updatedUser: updatedUser });
    } catch (err) {
        console.error("Error updating user role:", err);
        next(createError("Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
}