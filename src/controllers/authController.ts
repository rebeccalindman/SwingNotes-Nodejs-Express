// /controllers/authController.ts
// *  handles login, register, etc.

// todo
// POST /register
// POST /login
// POST /logout
// POST /reset-password

import { Request, Response, NextFunction } from "express";
import { addNewUser } from "../services/userService";
import { NewUser, PublicUser } from "../types/user";
import bcrypt from "bcrypt";
import { doesUserExistByEmail } from "../services/userService";
import { createError } from "../utils/createError";
import { HTTP_STATUS } from "../constants/httpStatus";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
      return next(createError("Missing required fields", HTTP_STATUS.BAD_REQUEST));
    }

    const validRoles = ["user", "admin"];
    if (role && !validRoles.includes(role)) {
    return next(createError("Invalid role", HTTP_STATUS.BAD_REQUEST));
    }

    const existingUser = await doesUserExistByEmail(email); //todo your service function
    if (existingUser) {
      return next(createError("User already exists", HTTP_STATUS.CONFLICT));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: NewUser = {
      username,
      hashedPassword,
      email,
      ...(role && { role }),
    };

    const createdUser: PublicUser = await addNewUser(newUser);

    res.status(HTTP_STATUS.CREATED).json({
      message: "User created",
      user: createdUser,
    });
  } catch (err) {
    next(err); // pass to errorHandler middleware
  }
}

export const login = (req: Request, res: Response, next: NextFunction) => {
  // todo
};