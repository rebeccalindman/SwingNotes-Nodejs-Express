// utils/transformNotes.ts
import { Note, PublicNote } from "../types/note";

export const noteToPublicNote = (note: Note): PublicNote => ({
    id: note.id,
    title: note.title,
    text: note.text,
    created_at: note.created_at.toISOString(),
    updated_at: note.updated_at?.toISOString(),
});

export const notesToPublicNotes = (notes: Note[]): PublicNote[] => notes.map(noteToPublicNote);