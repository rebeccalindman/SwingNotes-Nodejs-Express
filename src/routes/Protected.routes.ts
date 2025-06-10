import { Router } from 'express';
import { createNote, deleteNoteForUser, getAllCategoriesForUser, getAllNotesForUser, getNoteById, getNotesByCategory } from '../controllers/notesController';
import { validateNewNote } from '../middleware/validateNewNote';
import { get } from 'http';


const router = Router();


// notes-categories
router.get('/notes/categories', getAllCategoriesForUser);

/**
 * @swagger
 * /notes/categories:
 *   get:
 *     summary: Get all note categories for the user
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of note categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
// get all notes for a category and user
router.get('/notes/categories/:category', getNotesByCategory)

// todo notes-search (query)
router.get('/notes/search/', (req, res) => {
    res.send('search notes');
})

// notes-list - get all notes
/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes for the user
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notes found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PublicNote'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/notes', getAllNotesForUser);

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
/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete a note
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
 *     responses:
 *       200:
 *         description: Note deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */
router.delete('/notes/:id', deleteNoteForUser);
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
router.get('/notes/:id', getNoteById);



export default router;