import { Request, Response, NextFunction, Router } from 'express';
import { hash, genSalt, compare } from 'bcryptjs';
import Controller from '../interfaces/controller.interface';
import User from '../Users/user.interface';
import CreateUserDto from '../Users/user.dto';
import userModel from '../Users/user.model';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import ValidationMiddleware from '../middlewares/validation.middleware';
import LogInDto from './logIn.dto';
import AuthenticationService from './authentication.service';

class AuthenticationController implements Controller {
  public path: string = '/auth';
  public router: Router = Router();
  private user = userModel;
  private authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, ValidationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, ValidationMiddleware(LogInDto), this.loggingIn);
  }

  private registration = async (req: Request, res: Response, next: NextFunction) => {
    const userData: User = req.body;
    try {
      const registeredUser = await this.authenticationService.register(userData);
      res.status(201).json(registeredUser);
    } catch (error) {
      next(error);
    }
  };

  private loggingIn = async (req: Request, res: Response, next: NextFunction) => {
    const logInData: LogInDto = req.body;
    const foundUser: User = await this.user.findOne({ email: logInData.email });
    if (!foundUser) return next(new WrongCredentialsException());
    const isPasswordMatching = await compare(logInData.password, foundUser.password);
    if (!isPasswordMatching) return next(new WrongCredentialsException());
    foundUser.password = undefined;
    res.status(200).json(foundUser);
  };
}

export default AuthenticationController;
