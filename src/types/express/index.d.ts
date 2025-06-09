// types/express/index.d.ts
import express from 'express';
import { UserJwtPayload } from '../user';

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload;
    }
  }
}