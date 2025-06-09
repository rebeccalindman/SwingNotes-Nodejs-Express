// /controllers/authController.ts
// *  handles login, register, etc.

// todo
// POST /logout
// POST /reset-password

import { Request, Response, NextFunction } from "express";
import { addNewUser } from "../services/userService";
import { NewUser, PublicUser, UserJwtPayload } from "../types/user";
import bcrypt from "bcrypt";
import { createError } from "../utils/createError";
import { HTTP_STATUS } from "../constants/httpStatus";
import jwt from 'jsonwebtoken';
import { RequestWithUser } from "../types/express/requestWithUser";
import logger from "../utils/logger";



export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
      return next(createError("Missing required fields", HTTP_STATUS.BAD_REQUEST));
    }

    const validRoles = ["user", "admin"];
    if (role && !validRoles.includes(role)) {
    return next(createError("Invalid role", HTTP_STATUS.BAD_REQUEST));
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

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { password } = req.body;
    const user = (req as RequestWithUser).user;

    if (!user?.hashedpassword) {
      return next(createError("Incorrect user credentials", HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }


    const isMatch = await bcrypt.compare(password, user.hashedpassword);
  
    if (!isMatch) {
      return next(createError("Invalid credentials", HTTP_STATUS.UNAUTHORIZED));
    }
  
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    /**
     * JWT payload
     * Does not include any sensitive information
     */
    const payload: UserJwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });

    // send JWT token in response
    res.status(HTTP_STATUS.OK).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (err) {
    next(err)
  }
};