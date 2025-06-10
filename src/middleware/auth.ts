import { NextFunction, Request, Response  } from "express";
import { createError } from "../utils/createError";
import { HTTP_STATUS } from "../constants/httpStatus";
import jwt from "jsonwebtoken";
import { UserJwtPayload } from "../types/user";


export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return next(createError("Unauthorized: Missing or malformed token", HTTP_STATUS.UNAUTHORIZED));
    }

    const token = authHeader.split(" ")[1];
    
    
    console.log("Token:", token);
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("JWT_SECRET:", JWT_SECRET);

        if (
            typeof decoded === "object" &&
            "id" in decoded &&
            "username" in decoded &&
            "email" in decoded &&
            "role" in decoded
        ) {
            req.user = decoded as UserJwtPayload;
            return next(); // ✅ return here so it doesn't fall through
        } else {
            return next(createError("Unauthorized: Invalid token payload", HTTP_STATUS.UNAUTHORIZED));
        }
    } catch (err) {
        return next(createError("Unauthorized: Invalid or expired token", HTTP_STATUS.UNAUTHORIZED));
    }
};


export const validateRegisterInput = (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return next(createError("Missing required fields", HTTP_STATUS.BAD_REQUEST));
    }
    next();
};
export const validateLoginFields = (req: Request, res: Response, next: NextFunction) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        return next(createError("Email or username and password are required", HTTP_STATUS.BAD_REQUEST));
    }
    next();
};
