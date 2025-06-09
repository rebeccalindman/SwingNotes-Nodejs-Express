import { Request, Response, NextFunction } from "express";
import { findUserByEmail, findUserByUsername } from "../services/userService";
import { createError } from "../utils/createError";
import { HTTP_STATUS } from "../constants/httpStatus";


export const checkUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const { email, username } = req.body;
  let user;

  if (email) {
    user = await findUserByEmail(email);
  } else if (username) {
    user = await findUserByUsername(username);
  }

  if (!user) {
    return next(createError("User not found", HTTP_STATUS.NOT_FOUND));
  }

  req.user = user; // attach user to request object
  next();
};

export const checkUserNotExists = async (req: Request, res: Response, next: NextFunction) => {
    const { email, username } = req.body;
    let user;

    if (email) {
        user = await findUserByEmail(email);
    } else if (username) {
        user = await findUserByUsername(username);
    }

    if (user) {
        return next(createError(`User already exists for this ${email ? "email" : "username"}`, HTTP_STATUS.CONFLICT));
    }
    next();

};

