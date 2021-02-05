import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import User from '../Users/user.interface';
import CreateUserDto from '../Users/user.dto';
import ValidationMiddleware from '../middlewares/validation.middleware';
import LogInDto from './logIn.dto';
import AuthenticationService from './authentication.service';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import AuthenticationMiddleware from '../middlewares/authentication.middleware';

class AuthenticationController implements Controller {
  public path: string = '/auth';
  public router: Router = Router();
  private authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, ValidationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, ValidationMiddleware(LogInDto), this.loggingIn);
    this.router.post(`${this.path}/logout`, AuthenticationMiddleware, this.loggingOut);
    this.router.post(`${this.path}/logout/all`, AuthenticationMiddleware, this.loggingOutAll);
  }

  private registration = async (req: Request, res: Response, next: NextFunction) => {
    const userData: User = req.body;
    try {
      const { savedUser, token } = await this.authenticationService.register(userData);
      res.status(201).header('auth-token', token).json(savedUser);
    } catch (error) {
      next(error);
    }
  };

  private loggingIn = async (req: Request, res: Response, next: NextFunction) => {
    const logInData: LogInDto = req.body;
    try {
      const { foundUser, token } = await this.authenticationService.logIn(logInData);
      res.status(200).header('auth-token', token).json({ foundUser, token });
    } catch (error) {
      next(error);
    }
  };

  private loggingOut = async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    if (req.user) {
      const newTokensArray = req.user.tokens.filter((token) => token.token !== req.token);
      req.user.tokens = newTokensArray;
      await req.user.save();
      return res.status(200).header('auth-token', '').json({ message: 'Logged out!' });
    } else {
      return res.status(500);
    }
  };

  private loggingOutAll = async (req: RequestWithUser, res: Response, _next: NextFunction) => {
    if (req.user) {
      req.user.tokens = [];
      await req.user.save();
      res.status(200).header('auth-token', '').json({ message: 'All sessions logged out!' });
    } else {
      res.status(500);
    }
  };
}

export default AuthenticationController;
