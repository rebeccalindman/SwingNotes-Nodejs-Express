import { Router } from 'express';
import { createNote, getNoteById } from '../controllers/notesController';
import { validateNewNote } from '../middleware/validateNewNote';


const router = Router();


// create note
router.post("/notes", validateNewNote, createNote);
// update note
router.put('/notes/:id', (req, res) => {
    res.send('update note');
})
// delete note
router.delete('/notes/:id', (req, res) => {
    res.send('delete note');
})
// get one note
router.get('/notes/:id', (req, res, next) => {
  getNoteById(req, res, next);
});

// notes-list - get all notes
router.get('/notes', (req, res) => {
    res.send('get all notes');
})
// notes-search (query)
router.get('/notes/search', (req, res) => {
    res.send('search notes');
})


export default router;