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
  const result = await pool.query(`
    SELECT u.id, u.username, u.email, u.role, u.created_at, u.updated_at,
           COUNT(DISTINCT n.id) FILTER (WHERE n.owner_id = u.id) AS owned_notes,
           COUNT(DISTINCT nu.note_id) FILTER (WHERE nu.user_id = u.id AND nu.access_level != 'owner') AS shared_notes
    FROM users u
    LEFT JOIN notes n ON n.owner_id = u.id
    LEFT JOIN note_user nu ON nu.user_id = u.id
    GROUP BY u.id, u.username, u.email, u.role, u.created_at, u.updated_at
  `);
  return result.rows.map((row) => ({
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    created_at: row.created_at,
    updated_at: row.updated_at,
    owned_notes: row.owned_notes,
    shared_notes: row.shared_notes,
  }));
}

export async function findUserByEmail(email: string) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
}

export async function findUserByUsername(username: string) {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0] || null;
}

export async function findUserById(id: string) {
  const result = await pool.query("SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
}

export async function updateRoleOfUser(userId: string, role: string) {
  const result = await pool.query("UPDATE users SET role = $1 WHERE id = $2", [role, userId]);
  return result.rows[0] || null;
}


export async function checkIfOtherUserExists(userId: string) {
  const result = await pool.query("SELECT username FROM users WHERE userId = $1", [userId]);
  if (result.rows.length > 0) {
    return true;
  }
  return false;
}

