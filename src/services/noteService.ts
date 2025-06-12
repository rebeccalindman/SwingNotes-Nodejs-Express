import pool from "../db";
import { NewNote, PublicNote, Note } from "../types/note";
import { notesToPublicNotes } from "../utils/transformNotes";

export const fetchNoteByIdForUser = async (noteId: string, userId: string): Promise<Note | null> => {
  const result = await pool.query(
    `SELECT id, title, text, category, created_at, updated_at FROM notes WHERE id = $1 AND owner_id = $2`,
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
  await pool.query("DELETE FROM notes WHERE id = $1 AND owner_id = $2", [noteId, userId]);
};

export const fetchAllNotesForUser = async (userId: string): Promise<PublicNote[]> => {
  const result = await pool.query(
    `SELECT id, title, text, category, created_at, updated_at FROM notes WHERE owner_id = $1`,
    [userId]
  );
  return notesToPublicNotes(result.rows);
};

export const fetchNotesForCategory = async (category: string, userId: string): Promise<PublicNote[]> => {
  const result = await pool.query(
    `SELECT id, title, text, category, created_at, updated_at FROM notes WHERE owner_id = $1 AND category = $2`,
    [userId, category]
  );
  return notesToPublicNotes(result.rows);
};

export const fetchNotesCategoriesForUser = async (userId: string): Promise<string[]> => {
  const result = await pool.query(
    `SELECT DISTINCT category FROM notes WHERE owner_id = $1`,
    [userId]
  );
  return result.rows.map((row) => row.category);
}

export const fetchNotesBySearchTerm = async (searchTerm: string, userId: string): Promise<PublicNote[]> => {
  const result = await pool.query(
    `SELECT id, title, text, category, created_at, updated_at FROM notes WHERE owner_id = $2 AND (title ILIKE $1)`,
    [`%${searchTerm}%`, userId]
  );
  return notesToPublicNotes(result.rows);
};

export const updateNote = async (noteId: string, userId: string, note: NewNote): Promise<PublicNote> => {
  const result = await pool.query(
    `UPDATE notes SET title = $1, text = $2, category = $3
     WHERE id = $4 AND owner_id = $5
     RETURNING id, title, text, category, created_at, updated_at`,
    [note.title, note.text, note.category, noteId, userId]
  );
  return result.rows[0];
};