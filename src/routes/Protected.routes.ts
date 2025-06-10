import { Router } from 'express';
import { createNote, deleteNoteForUser, getAllCategoriesForUser, getAllNotesForUser, getNoteById, getNotesBySearchTerm, getNotesForCategory } from '../controllers/notesController';
import { validateNewNote } from '../middleware/validateNewNote';
import { get } from 'http';


const router = Router();


// notes-categories
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
 *         description: Note categories found
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
router.get('/notes/categories/:category', getNotesForCategory)

// todo notes-search (query)
/**
 * @swagger
 * /notes/search:
 *   get:
 *     summary: Search notes
 *     tags:
 *       - Notes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
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
router.get('/notes/search', getNotesBySearchTerm);

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
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Note deleted successfully
 *                Deleted:
 *                  type: string
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *                  format: uuid
 *                  description: The ID of the deleted note
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