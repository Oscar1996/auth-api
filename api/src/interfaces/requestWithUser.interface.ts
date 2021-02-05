import { Request } from 'express';
import { Document } from 'mongoose';
import User from '../Users/user.interface';

interface RequestWithUser extends Request {
  user: User & Document;
  token: string;
}

export default RequestWithUser;
