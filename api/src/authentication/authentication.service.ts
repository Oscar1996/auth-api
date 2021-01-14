import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import dataStoreInToken from '../interfaces/dataStoreInToken';
import User from '../Users/user.interface';
import userModel from '../Users/user.model';

class AuthenticationService {
  public user = userModel;
  constructor() {}

  public async register(userData: User) {
    const foundUser = await this.user.findOne({ email: userData.email });
    if (foundUser) throw new UserWithThatEmailAlreadyExistsException(userData.email);
    const hashedPassword = await hash(userData.password, 12);
    const createdUser = new this.user({
      ...userData,
      password: hashedPassword
    });
    const token = this.createToken(createdUser);
    createdUser.tokens.push({ token });
    const savedUser = await createdUser.save();
    savedUser.password = undefined;
    return savedUser;
  }

  private createToken(user: User): string {
    const expiresIn = 3600; // an hour
    const secret = process.env.SECRET_TOKEN;
    const dataStoreInToken: dataStoreInToken = {
      _id: user._id
    };
    return sign(dataStoreInToken, secret, { expiresIn });
  }
}

export default AuthenticationService;
