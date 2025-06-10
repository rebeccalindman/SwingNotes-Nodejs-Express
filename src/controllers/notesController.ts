// src/controllers/notesController.ts
import { Request, Response, NextFunction } from "express";
import { fetchNoteByIdForUser, addNewNote } from "../services/noteService";
import { noteToPublicNote } from "../utils/transformNotes";
import { Note, PublicNote, NewNote } from "../types/note";
import { HTTP_STATUS } from "../constants/httpStatus";
import { TypedAuthRequest } from '../types/express/typedRequest';
import { validate as isUUID } from 'uuid';

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
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "Unauthorized" });
    }

    const noteId = req.params.id;
    if (!isUUID(noteId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Invalid note ID format" });
    }

    const note = await fetchNoteByIdForUser(noteId, userId);

    if (!note) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Note not found or not yours" });
    }

    res.status(HTTP_STATUS.OK).json({ note: noteToPublicNote(note) });
  } catch (err) {
    console.error("Error fetching note:", err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};