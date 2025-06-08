// /services/userService.ts
import { NewUser, PublicUser } from "../types/user";
import db from "../db";


export async function addNewUser(user: NewUser): Promise<PublicUser> {
    const result = await db.query(
        `INSERT INTO users (username, email, hashedpassword, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, role, created_at`,
        [user.username, user.email, user.hashedPassword, user.role]
    );

    return result.rows[0]; // Return the PublicUser
}


export async function getAllUsers(): Promise<PublicUser[]> {
    const result = await db.query("SELECT id, username, email, role, created_at FROM users");
    return result.rows;
}

export async function doesUserExistByEmail(email: string): Promise<boolean> {
    const result = await db.query<{exists: boolean}>(
        "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1) AS exists",
        [email]
    );
    return result.rows[0].exists;
}