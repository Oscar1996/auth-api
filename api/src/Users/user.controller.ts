import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from './user.model';
import User from './user.interface';
import postModel from '../Posts/post.model';
import NotAuthorizedException from '../exceptions/NotAuthorizedExeption';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authenticationMiddleware from '../middlewares/authentication.middleware';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import validationMiddleware from '../middlewares/validation.middleware';
import CreateUserDto from '../Users/user.dto';

class UserController implements Controller {
  public path: string = '/users';
  public router: Router = Router();
  private user = userModel;
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/current-user`, authenticationMiddleware, this.getCurrentUser);
    this.router.get(`${this.path}/posts`, authenticationMiddleware, this.getAllPostsOfUser);
    this.router.patch(
      `${this.path}/modify-user`,
      validationMiddleware(CreateUserDto, true),
      authenticationMiddleware,
      this.modifyCurrentUser
    );
    this.router.delete(`${this.path}/delete-user`, authenticationMiddleware, this.deleteCurrentUser);
  }

  private getAllPostsOfUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const posts = await this.post.find({ author: req.user._id });
    if (req.user) {
      return res.status(200).json(posts);
    } else {
      return next(new NotAuthorizedException());
    }
  };

  private getCurrentUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (req.user) {
      return res.status(200).json(req.user);
    } else {
      return next(new NotAuthorizedException());
    }
  };

  private modifyCurrentUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) return next(new NotAuthorizedException());
    const id = req.user._id;
    const userData: User = req.body;
    const updatedUser = await this.user.updateOne({ _id: id }, userData, { new: true });
    if (!updatedUser) return next(new UserNotFoundException(id));
    return res.status(200).json(updatedUser);
  };

  private deleteCurrentUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) return next(new NotAuthorizedException());
    const id = req.user._id;
    const deletedUser = await this.user.deleteOne({ _id: id });
    if (!deletedUser) return next(new UserNotFoundException(id));
    try {
      await this.post.deleteMany({ author: id });
      return res.status(200).json(req.user);
    } catch (error) {
      return res.status(500);
    }
  };
}

export default UserController;
