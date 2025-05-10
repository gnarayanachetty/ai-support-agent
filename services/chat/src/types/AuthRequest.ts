import { Request } from 'express';

// You can expand this type as needed for your user object
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    // Add more user properties if needed
  };
}
