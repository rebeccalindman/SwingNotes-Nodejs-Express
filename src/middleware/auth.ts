import { NextFunction, Request, Response  } from "express";
import { createError } from "../utils/createError";
import { HTTP_STATUS } from "../constants/httpStatus";



export const validateRegisterInput = (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return next(createError("Missing required fields", HTTP_STATUS.BAD_REQUEST));
    }
    next();
};

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return next(createError("Unauthorized", HTTP_STATUS.UNAUTHORIZED));
    }
    next();
};

export const validateLoginFields = (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;
  if ((!email && !username) || !password) {
    return next(createError("Email or username and password are required", HTTP_STATUS.BAD_REQUEST));
  }
  next();
};
