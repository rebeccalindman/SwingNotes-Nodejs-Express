// /types/notes.ts
export interface Note {
    id: string;
    title: string;
    text: string;
    created_at: Date;
    updated_at?: Date;
}

export interface NewNote {
    title: string;
    text: string;
}