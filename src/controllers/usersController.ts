import { Request, Response, NextFunction } from "express";
import { addNewUser } from "../services/userService";
import { NewUser, PublicUser } from "../types/user";
import bcrypt from "bcrypt";
import { getUserByEmail } from "../services/userService";
import { createError } from "../utils/createError";



export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existingUser = await getUserByEmail(email); //todo your service function
    if (existingUser) {
      return next(createError("User already exists", 409));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: NewUser = {
      username,
      hashedPassword,
      email,
      role,
    };

    const createdUser: PublicUser = await addNewUser(newUser);

    res.status(201).json(createdUser);
  } catch (err) {
    // Pass to errorHandler middleware
    next(err);
  }
}

//Helper Functions

// todo Check if user already exists
// PublicUser type
