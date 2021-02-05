import { Response, NextFunction } from 'express';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../Users/user.model';
import jwt from 'jsonwebtoken';
import dataStoreInToken from '../interfaces/dataStoreInToken';

const AuthenticationMiddleware = async (req: RequestWithUser, _res: Response, next: NextFunction) => {
  const user = userModel;
  if (!req.header('Authorization')) return next(new AuthenticationTokenMissingException());
  const [type, token] = req?.header('Authorization').split(' ');
  if (type === 'Bearer' && typeof token !== 'undefined') {
    const secret = process.env.SECRET_TOKEN;
    try {
      const verificationResponse = jwt.verify(token, secret) as dataStoreInToken;
      const id = verificationResponse._id;
      const verifyUser = await user.findOne({ _id: id });
      if (!verifyUser) return next(new WrongAuthenticationTokenException());
      req.user = verifyUser;
      req.token = token;
      next();
    } catch (err) {
      return next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
};

export default AuthenticationMiddleware;
