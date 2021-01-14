import { Request, Response, Router } from 'express';

import Controller from '../interfaces/controller.interface';
import User from './user.interface';
import userModel from './user.model';

class UserController implements Controller {
  public path: string = '/users';
  public router: Router = Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
  }

  getAllUsers = async (_req: Request, res: Response) => {
    const users = await this.user.find();
    if (!users) return res.status(404).json({ message: 'Users not found!' });
    return res.status(200).json(users);
  };

  getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await this.user.findById(id);
    if (!user) res.status(404).json({ message: 'User not found!' });
    res.status(200).json(user);
  };
}

export default UserController;
