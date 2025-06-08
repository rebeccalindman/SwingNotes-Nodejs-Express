import { NextFunction, Request, Response  } from "express";
import { createError } from "../utils/createError";

import pool from "../db";

export const checkUserExists = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
    ]);
    if (user.rows.length > 0) {
        return next(createError("User already exists", 409));
    }
    next();
};

export const validateRegisterInput = (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return next(createError("Missing required fields", 400));
    }
    next();
};