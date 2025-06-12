// middleware/validateNewNote.ts
import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";
import { HTTP_STATUS } from "../constants/httpStatus";

export const validateNewNote = (req: Request, res: Response, next: NextFunction) => {
  const { title, text, category } = req.body;

  if (!title || !text || !category) {
    return next(createError("Missing required fields", HTTP_STATUS.BAD_REQUEST));
  }

  if (typeof title !== "string" || typeof text !== "string" || typeof category !== "string") {
    return next(createError("Invalid data types", HTTP_STATUS.BAD_REQUEST));
  }

  next();
};