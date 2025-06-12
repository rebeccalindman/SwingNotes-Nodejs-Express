import { access } from "fs";
import pool from "../db";
import { NewNote, PublicNote, Note } from "../types/note";
import { notesToPublicNotes } from "../utils/transformNotes";
import { PublicUser } from "../types/user";

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
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
        `INSERT INTO notes (title, text, category, owner_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, text, category, created_at, updated_at`,
        [note.title, note.text, note.category, userId]
        );

        const newNote = result.rows[0];

        // Insert owner access into note_user
        await client.query(
        `INSERT INTO note_user (note_id, user_id, access_level)
        VALUES ($1, $2, $3)`,
        [newNote.id, userId, 'owner']
        );

        await client.query('COMMIT');
        return newNote;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
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

export const fetchSharedNotesBySearchTerm = async (
  searchTerm: string,
  userId: string
): Promise<PublicNote[]> => {
  const result = await pool.query(
    `SELECT n.id, n.title, n.text, n.category, n.created_at, n.updated_at, nu.access_level
     FROM notes n
     JOIN note_user nu ON n.id = nu.note_id
     WHERE nu.user_id = $1 AND n.owner_id != $1 AND (n.title ILIKE $2 OR n.text ILIKE $2)`,
    [userId, `%${searchTerm}%`]
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

export const shareNote = async (userId: string, noteId: string, accessLevel: string): Promise<'inserted' | 'updated'> => {
    const existing = await pool.query(
        `SELECT access_level FROM note_user WHERE user_id = $1 AND note_id = $2`,
        [userId, noteId]
    );

    if (existing !== null && existing.rowCount !== null && existing.rowCount > 0) {
        if (existing.rows[0].access_level !== accessLevel) {
        await pool.query(
            `UPDATE note_user SET access_level = $3 WHERE user_id = $1 AND note_id = $2`,
            [userId, noteId, accessLevel]
        );
        return 'updated';
        } else {
        // No change needed
        return 'updated';  // or 'unchanged' if you want to differentiate
        }
    } else {
        await pool.query(
        `INSERT INTO note_user (user_id, note_id, access_level) VALUES ($1, $2, $3)`,
        [userId, noteId, accessLevel]
        );
        return 'inserted';
    }
};

export const fetchAllSharedNotesForUser = async (userId: string): Promise<PublicNote[]> => {
  const result = await pool.query(
    `SELECT n.id, n.title, n.text, n.category, n.created_at, n.updated_at, nu.access_level
     FROM notes n
     JOIN note_user nu ON n.id = nu.note_id
     WHERE nu.user_id = $1 AND n.owner_id != $1`,
    [userId]
  );

  return notesToPublicNotes(result.rows);
};

export const fetchNoteAccessList = async (noteId: string): Promise<
  { username: string; accessLevel: string }[]
> => {
  const result = await pool.query(
    `SELECT u.username, nu.access_level
     FROM note_user nu
     JOIN users u ON nu.user_id = u.id
     WHERE nu.note_id = $1`,
    [noteId]
  );

  return result.rows; // array of { username, access_level }
};

//* Fetch note by ID, disregarding access level
export const fetchNoteById = async (noteId: string): Promise<Note | null> => {
  const result = await pool.query(
    `SELECT id, title, text, category, created_at, updated_at, owner_id
     FROM notes WHERE id = $1`,
    [noteId]
  );

  return result.rows[0] || null;
};