import { AppError } from "../middlewares/errorHandler";
export const createError = (message: string, status: number): AppError => {
  const error = new Error(message) as AppError;
  error.status = status;
  return error;
};
