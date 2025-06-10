import { Router } from 'express';
import { createNote, getNoteById } from '../controllers/notesController';
import { validateNewNote } from '../middleware/validateNewNote';


const router = Router();


// create note
/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     tags: 
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewNote'
 *     responses:
 *       201:
 *         description: Note created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicNote'
 *       400:
 *         description: Bad request - Missing or invalid fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a single note
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the note
 *     responses:
 *       200:
 *         description: Note found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicNote'
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
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