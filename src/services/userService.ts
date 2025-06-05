import { NewUser } from "../types/user";
import db from "../db";

export async function addNewUser(user: NewUser) {
    const result = await db.query(
        "INSERT INTO users (username, email, hashedPassword, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [user.username, user.email, user.hashedPassword, user.role]
    );
    return result.rows[0];
}

export async function getUserByEmail(email: string) {
    const result = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    return result.rows[0];
}