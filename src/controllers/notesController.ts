// src/controllers/notesController.ts
import { Request, Response, NextFunction } from "express";
import { fetchNoteByIdForUser, addNewNote, deleteNote, fetchAllNotesForUser, fetchNotesCategoriesForUser, fetchNotesForCategory } from "../services/noteService";
import { noteToPublicNote } from "../utils/transformNotes";
import { Note, PublicNote, NewNote } from "../types/note";
import { HTTP_STATUS } from "../constants/httpStatus";
import { TypedAuthRequest } from '../types/express/typedRequest';
import { validate as isUUID } from 'uuid';
import { createError } from "../utils/createError";

export const createNote = async (
  req: TypedAuthRequest<NewNote>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const note = await addNewNote(req.body, userId);
    res.status(201).json({ message: 'Note created', note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) {
    return next(createError("Unauthorized, user ID not found", HTTP_STATUS.UNAUTHORIZED));
  }

  const noteId = req.params.id;
  if (!isUUID(noteId)) {
    return next(createError("Invalid note ID format", HTTP_STATUS.BAD_REQUEST));
  }

  try {
    const note = await fetchNoteByIdForUser(noteId, userId);

    if (!note) {
      return next(createError("Note not found or not yours", HTTP_STATUS.NOT_FOUND));
    }

    res.status(HTTP_STATUS.OK).json({ note: noteToPublicNote(note) });
  } catch (err) {
    console.error("Error fetching note:", err);
    next(createError("Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
};

export const deleteNoteForUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const noteId = req.params.id;

  if (!userId) {
    return next(createError("Unauthorized, user ID not found", HTTP_STATUS.UNAUTHORIZED));
  }

  if (!noteId) {
    return next(createError("Provide a note ID", HTTP_STATUS.BAD_REQUEST));
  }

  const note = await fetchNoteByIdForUser(noteId, userId);

  if (!note) {
    return next(createError("Note not found or not yours", HTTP_STATUS.NOT_FOUND));
  }

  if (!isUUID(noteId)) {
    return next(createError("Invalid note ID format", HTTP_STATUS.BAD_REQUEST));
  }

  try {
    await deleteNote(noteId, userId);
    res.status(HTTP_STATUS.OK).json({ message: "Note deleted successfully", Deleted: noteId });
    return;
  } catch (err) {
    console.error("Error deleting note:", err);
    next(createError("Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR));
    return;
  }
};

export const getAllNotesForUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) {
    return next(createError("Unauthorized, user ID not found", HTTP_STATUS.UNAUTHORIZED));
  }

  try {
    const notes = await fetchAllNotesForUser(userId);
    res.status(HTTP_STATUS.OK).json({ notes: notes});
  } catch (err) {
    console.error("Error fetching notes:", err);
    next(createError("Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
};

export const getNotesForCategory = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) {
    return next(createError("Unauthorized, user ID not found", HTTP_STATUS.UNAUTHORIZED));
  }

  const category = req.params.category;

  try {
    const notes = await fetchNotesForCategory(category, userId);
    if (notes.length === 0) {
      return next(createError("No notes found for this category", HTTP_STATUS.NOT_FOUND));
    }
    res.status(HTTP_STATUS.OK).json({ notes: notes});
  } catch (err) {
    console.error("Error fetching notes:", err);
    next(createError("Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
};

export const getAllCategoriesForUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) {
    return next(createError("Unauthorized, user ID not found", HTTP_STATUS.UNAUTHORIZED));
  }

  try {
    const categories = await fetchNotesCategoriesForUser(userId);
    res.status(HTTP_STATUS.OK).json({ categories: categories});

    if (categories.length === 0) {
      return next(createError("No categories found", HTTP_STATUS.NOT_FOUND));
    }
  } catch (err) {
    console.error("Error fetching notes:", err);
    next(createError("Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
};