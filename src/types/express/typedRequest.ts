import { Request } from 'express';
import { UserJwtPayload } from '../user';

// Generic typed request for body-only typing
export interface TypedRequestBody<T> extends Request {
  body: T;
}

// Generic typed request with both body and authenticated user
export interface TypedAuthRequest<T> extends Request {
  body: T;
  user?: UserJwtPayload;
}