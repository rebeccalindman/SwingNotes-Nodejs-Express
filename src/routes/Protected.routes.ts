import { Router } from 'express';
import { createNote, deleteNoteForUser, getAllCategoriesForUser, getAllNotesForUser, getAllSharedNotesForUser, getNoteAccessList, getNoteById, getNotesBySearchTerm, getNotesForCategory, revokeAccessToNote, shareNoteWithUser, updateNoteForUser } from '../controllers/notesController';
import { validateNewNote } from '../middleware/validateNewNote';
import { attachNoteAccessLevel } from '../middleware/noteAccess';
import { logout, refreshToken } from '../controllers/authController';



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

/**
 * @swagger
 * /notes/shared:
 *   get:
 *     summary: Get all notes shared with the user, which the user does not own themselves
 *     tags:
 *       - Note-sharing
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
router.get('/notes/shared', getAllSharedNotesForUser);

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
router.delete('/notes/:id', attachNoteAccessLevel, deleteNoteForUser);
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
router.get('/notes/:id', attachNoteAccessLevel, getNoteById);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update a note
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
 *         description: The ID of the note to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewNote'
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicNote'
 *       400:
 *         description: Bad request - Missing or invalid fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */
router.put('/notes/:id', attachNoteAccessLevel, updateNoteForUser);

/**
 * @swagger
 * /notes/{id}/share:
 *   post:
 *     summary: Share a note with another user
 *     tags:
 *       - Note-sharing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the note to share
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SharedNoteInput'
 *     responses:
 *       201:
 *         description: Note shared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Note shared successfully
 *       400:
 *         description: Bad request - Missing or invalid fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */
router.post ('/notes/:id/share', attachNoteAccessLevel, shareNoteWithUser);

/**
 * @swagger
 * /notes/{id}/share:
 *   delete:
 *     summary: Revoke access for other users to a shared note
 *     tags:
 *       - Note-sharing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the note to revoke access
 *     responses:
 *       200:
 *         description: Access revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access revoked successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.delete('/notes/:id/share', attachNoteAccessLevel, revokeAccessToNote);

/**
 * @swagger
 * /notes/{id}/access-list:
 *   get:
 *     summary: Get access list of a note
 *     tags:
 *       - Note-sharing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the note to get access list
 *     responses:
 *       200:
 *         description: Access list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       accessLevel:
 *                         type: string
 *                         enum: [read, edit, owner]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/notes/:id/access-list', attachNoteAccessLevel, getNoteAccessList);

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Refresh access token
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refresh token successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout
 *     description: Logout the user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post ('/logout', logout);


export default router;