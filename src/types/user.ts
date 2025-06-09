// /types/user.ts
export interface User {
  id: string;
  username: string;
  email: string;
  hashedpassword: string; 
  role: string;
  created_at: Date; 
  updated_at?: Date; 
}

// Client sends
export interface NewUser {
  username: string;
  email: string;
  hashedpassword: string;
  role?: string; // (defaults to 'user' in db if not provided)
}

// Client receives 
export interface PublicUser {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}
