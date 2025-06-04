import { NewUser } from "../types/user";
import db from "../db";

export async function addNewUser(user: NewUser) {
    const result = await db.query(
        "INSERT INTO users (username, email, hashedPassword, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [user.username, user.email, user.hashedPassword, user.role]
    );
    return result.rows[0];
}