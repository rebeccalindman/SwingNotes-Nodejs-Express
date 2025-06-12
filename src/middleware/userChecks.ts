import { Request, Response, NextFunction } from "express";
import { findUserByEmail, findUserByUsername } from "../services/userService";
import { createError } from "../utils/createError";
import { HTTP_STATUS } from "../constants/httpStatus";


export const checkUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const { identifier } = req.body;

    let user;

    if (identifier.includes("@")) {
    user = await findUserByEmail(identifier);
    } else {
    user = await findUserByUsername(identifier);
    }

  if (!user) {
    return next(createError("User not found", HTTP_STATUS.NOT_FOUND));
  }

  req.user = user; // attach user to request object
  next();
};

export const checkUserNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const { email, username } = req.body;

  if (!email || !username) {
    return next(createError("Email and username are required", HTTP_STATUS.BAD_REQUEST));
  }

  const userByEmail = await findUserByEmail(email);
  if (userByEmail) {
    return next(createError("User already exists with this email", HTTP_STATUS.CONFLICT));
  }

  const userByUsername = await findUserByUsername(username);
  if (userByUsername) {
    return next(createError("User already exists with this username", HTTP_STATUS.CONFLICT));
  }

  next();
};


