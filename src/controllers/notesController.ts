// src/controllers/notesController.ts
import { Request, Response, NextFunction } from "express";
import { 
    fetchNoteByIdForUser, 
    addNewNote, 
    deleteNote, 
    fetchAllNotesForUser, 
    fetchNotesCategoriesForUser, 
    fetchNotesForCategory,
    fetchNotesBySearchTerm,
    updateNote,
    shareNote,
    fetchAllSharedNotesForUser,
    fetchSharedNotesBySearchTerm,
    fetchNoteAccessList,
    fetchNoteById,
    removeAccessToNoteFromDB
} from "../services/noteService";

import { findUserByUsername } from "../services/userService";

import { noteToPublicNote } from "../utils/transformNotes";
import { NewNote } from "../types/note";
import { HTTP_STATUS } from "../constants/httpStatus";
import { TypedAuthRequest } from '../types/express/typedRequest';
import { validate as isUUID } from 'uuid';
import { createError } from "../utils/createError";
import { hasEditOrOwnerAccess, hasOwnerAccess, hasReadAccess } from "../utils/accessControl";

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


export const getNoteById = async (req: TypedAuthRequest<any>, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const noteId = req.params.id;

  if (!hasReadAccess(req)) {
    return next(createError(`Forbidden: You need read access to view this note, you have ${req.accessLevel} access`, HTTP_STATUS.FORBIDDEN));
  }

  if (!userId) {
    return next(createError("Unauthorized, user ID not found", HTTP_STATUS.UNAUTHORIZED));
  }

  if (!isUUID(noteId)) {
    return next(createError("Invalid note ID format", HTTP_STATUS.BAD_REQUEST));
  }

  if (!req.accessLevel || !['read', 'edit', 'owner'].includes(req.accessLevel)) {
    return next(createError(`Forbidden: You do not have permission to view this note`, HTTP_STATUS.FORBIDDEN));
  }

  try {
    const note = await fetchNoteById(noteId);
    if (!note) {
      return next(createError("Note not found", HTTP_STATUS.NOT_FOUND));
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

    if(!hasOwnerAccess(req)) {
        return next(createError(`Forbidden: You need owner access to delete this note, you have ${req.accessLevel} access`, HTTP_STATUS.FORBIDDEN));
    }

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

export const getAllSharedNotesForUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
        return next(createError("Unauthorized, user ID not found", HTTP_STATUS.UNAUTHORIZED));
    }

    try {
        const notes = await fetchAllSharedNotesForUser(userId);
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

    export const getNotesBySearchTerm = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
        return next(createError("Unauthorized, user ID not found", HTTP_STATUS.UNAUTHORIZED));
    }

    const searchTerm = req.query.q as string;

    try {
        const notes = await fetchNotesBySearchTerm(searchTerm, userId);
        if (notes.length === 0) {
        return next(createError("No notes found for this search term", HTTP_STATUS.NOT_FOUND));
        }
        const sharedNotes = await fetchSharedNotesBySearchTerm(searchTerm, userId);

        res.status(HTTP_STATUS.OK).json({ notes: notes, sharedNotes: sharedNotes});
    } catch (err) {
        console.error("Error fetching notes:", err);
        next(createError("Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
};

export const updateNoteForUser = async (req: TypedAuthRequest<NewNote>, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const noteId = req.params.id;

    if (!hasEditOrOwnerAccess(req)) {
    return next(createError(`Forbidden: You need edit or owner access to update this note, you have ${req.accessLevel}`, 403));
  }

    if (!userId) {
        return next(createError("Unauthorized, user ID not found", HTTP_STATUS.UNAUTHORIZED));
    }

    if (!noteId) {
        return next(createError("Provide a note ID", HTTP_STATUS.BAD_REQUEST));
    }

    if (!isUUID(noteId)) {
        return next(createError("Invalid note ID format", HTTP_STATUS.BAD_REQUEST));
    }

    const note = await fetchNoteByIdForUser(noteId, userId);

    if (!note) {
        return next(createError("Note not found or not yours", HTTP_STATUS.NOT_FOUND));
    }

    if (!req.body.category) {
        req.body.category = note.category;
    }

    let newNote = {
        title: req.body.title || note.title,
        text: req.body.text || note.text,
        category: req.body.category || note.category,
    };

    if (!newNote.title || !newNote.text) {
        return next(createError("Title and text are required", HTTP_STATUS.BAD_REQUEST));
    }

    try {
        const updatedNote = await updateNote(noteId, userId, newNote);
        res.status(HTTP_STATUS.OK).json({ message: "Note updated successfully", note: updatedNote });
    } catch (err) {
        console.error("Error updating note:", err);
        next(createError("Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR));  
    }
};

type AccessLevel = "read" | "edit" | "owner";
type SharedNote = {
  sharedWith: string;
  accessLevel?: AccessLevel;
};

type SharedNoteInput = {
  username: string;
  accessLevel: AccessLevel;
};

export const shareNoteWithUser = async (req: Request, res: Response, next: NextFunction) => {
  const currentUserId = req.user?.id;
  const noteId = req.params.id;
  const { username, accessLevel = 'read'} = req.body as SharedNoteInput;
  const sharedWith = username;

  if (accessLevel !== 'read' && accessLevel !== 'edit') {
    return next(createError("Invalid access level, should be 'read' or 'edit'", HTTP_STATUS.BAD_REQUEST));
  }

  if (!hasOwnerAccess(req)) {
    return next(createError(`Forbidden: Only owners can share this note, you have ${req.accessLevel} access`, 403));
  }

  if (!isUUID(noteId)) {
    return next(createError("Invalid note ID format", HTTP_STATUS.BAD_REQUEST));
  }

  const userToShareWith = await findUserByUsername(sharedWith);
  if (!userToShareWith) {
    return next(createError("Other user not found, provide a valid username", HTTP_STATUS.NOT_FOUND));
  }

  const recipientUserId = userToShareWith.id;

  if (recipientUserId === currentUserId) {
    return next(createError("You cannot share a note with yourself", HTTP_STATUS.BAD_REQUEST));
  }

  try {
    const status = await shareNote(recipientUserId, noteId, accessLevel);

    if (status === 'inserted') {
      res.status(HTTP_STATUS.CREATED).json({ message: "Note shared successfully (new share)" });
    } else if (status === 'updated') {
      res.status(HTTP_STATUS.OK).json({ message: "Note share updated successfully" });
    } else {
      res.status(HTTP_STATUS.OK).json({ message: "Note shared successfully" });
    }
  } catch (err) {
    console.error("Error sharing note:", err);
    next(createError("Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
};

export const getNoteAccessList = async (req: Request, res: Response, next: NextFunction) => {
  const noteId = req.params.id;
  
  if (!isUUID(noteId)) {
    return next(createError("Invalid note ID", HTTP_STATUS.BAD_REQUEST));
  }

  try {
    const accessList = await fetchNoteAccessList(noteId);
    res.status(200).json({ accessList });
  } catch (err) {
    console.error("Error fetching access list:", err);
    next(createError("Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
};

export const revokeAccessToNote = async (req: Request, res: Response, next: NextFunction) => {
  const noteId = req.params.id;
  const userId = req.user?.id;
  
  if (!userId) {
    return next(createError("Unauthorized, user ID in request not found", HTTP_STATUS.UNAUTHORIZED));
  }

  if (!isUUID(noteId)) {
    return next(createError("Invalid note ID", HTTP_STATUS.BAD_REQUEST));
  }

  if (!hasOwnerAccess(req)) {
    return next(createError(`Forbidden: Only owners can revoke access to this note, you have ${req.accessLevel} access`, HTTP_STATUS.FORBIDDEN));  
  }

  try {
    await removeAccessToNoteFromDB(noteId);
    res.status(200).json({ message: "Access revoked successfully" });
  } catch (err) {
    console.error("Error revoking access:", err);
    next(createError("Internal Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
};