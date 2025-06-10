// /services/userService.ts
import { NewUser, PublicUser } from "../types/user";
import pool from "../db";


export const addNewUser = async (user: NewUser): Promise<PublicUser> => {
  const values = [user.username, user.hashedpassword, user.email];
  let query = `
    INSERT INTO users (username, hashedpassword, email`;

  if (user.role) { // role is optional, this prevents null in DB
    query += `, role`;
    values.push(user.role);
  }

  query += `)
    VALUES ($1, $2, $3${user.role ? ', $4' : ''})
    RETURNING id, username, email, role, created_at`;

  const result = await pool.query(query, values);
  return result.rows[0];
};


export async function fetchAllUsers(): Promise<PublicUser[]> {
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