import { Request, Response, NextFunction } from 'express';
import pool from '../db'; // adjust to your db import
import {createError} from '../utils/createError';


export const attachNoteAccessLevel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const noteId = req.params.id;

    if (!user) {
      return next(createError('Unauthorized, user not found', 401));
    }

    if (!noteId) {
      return next(createError('Note ID is required', 400));
    }

/*     if (user.role === 'admin') {
      // Admin has full access
      req.accessLevel = 'owner';
      return next();
    } */

    // Query DB for user access to the note
    const result = await pool.query(
      'SELECT access_level FROM note_user WHERE user_id = $1 AND note_id = $2',
      [user.id, noteId]
    );

    if (result.rowCount === 0) {
      return next(createError('Access denied to this note', 403));
    }

    req.accessLevel = result.rows[0].access_level;

    next();
  } catch (error) {
    console.error('Error in attachNoteAccessLevel middleware:', error);
    next(createError('Internal Server Error', 500));
  }
};
