import { User } from '../../../shared/schemas';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}