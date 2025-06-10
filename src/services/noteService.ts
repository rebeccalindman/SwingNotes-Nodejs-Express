import pool from "../db";
import { NewNote, PublicNote, Note } from "../types/note";

export const fetchNoteByIdForUser = async (noteId: string, userId: string): Promise<Note | null> => {
  const result = await pool.query(
    `SELECT * FROM notes WHERE id = $1 AND user_id = $2`,
    [noteId, userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0] || null;
};

export const addNewNote = async (note: NewNote, userId: string): Promise<PublicNote> => {
  const result = await pool.query(
    `INSERT INTO notes (title, text, category, user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, text, category, created_at, updated_at`,
    [note.title, note.text, note.category, userId]
  );

  return result.rows[0]; // Return the PublicNote
};

export const deleteNote = async (noteId: string, userId: string): Promise<void> => {
  await pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [noteId, userId]);
};