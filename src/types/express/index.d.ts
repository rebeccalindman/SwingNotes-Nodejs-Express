// types/express/index.d.ts
import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        // add any other properties your user object has
      };
    }
  }
}