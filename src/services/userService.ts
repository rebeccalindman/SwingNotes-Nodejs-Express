// /services/userService.ts
import { NewUser, PublicUser } from "../types/user";
import pool from "../db";


export async function addNewUser(user: NewUser): Promise<PublicUser> {
    const result = await pool.query(
        `INSERT INTO users (username, email, hashedpassword, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, role, created_at`,
        [user.username, user.email, user.hashedpassword, user.role]
    );

    return result.rows[0]; // Return the PublicUser
}


export async function getAllUsers(): Promise<PublicUser[]> {
    const result = await pool.query("SELECT id, username, email, role, created_at FROM users");
    return result.rows;
}

export async function findUserByEmail(email: string) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
}

export async function findUserByUsername(username: string) {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0] || null;
}