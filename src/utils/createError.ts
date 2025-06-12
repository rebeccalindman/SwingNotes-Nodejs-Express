import { AppError } from "../middleware/errorHandler";
export const createError = (message: string, status: number): AppError => {
  const error = new Error(message) as AppError;
  error.status = status;
  return error;
};
