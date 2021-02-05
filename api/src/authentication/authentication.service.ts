import { hash, genSalt, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import dataStoreInToken from '../interfaces/dataStoreInToken';
import User from '../Users/user.interface';
import userModel from '../Users/user.model';
import LogInDto from './logIn.dto';
import UserDto from '../Users/user.dto';

class AuthenticationService {
  private user = userModel;
  constructor() {}

  public async register(userData: UserDto) {
    const foundUser = await this.user.findOne({ email: userData.email });
    if (foundUser) throw new UserWithThatEmailAlreadyExistsException(userData.email);
    const salt = await genSalt(12);
    const hashedPassword = await hash(userData.password, salt);
    const createdUser = new this.user({
      ...userData,
      password: hashedPassword
    });
    const token = this.createToken(createdUser);
    createdUser.tokens.push({ token });
    const savedUser = await createdUser.save();
    savedUser.password = undefined;
    return { savedUser, token };
  }

  public async logIn(logData: LogInDto) {
    const logInData: LogInDto = logData;
    // Check if the credenditals are correct
    let foundUser: User = await this.user.findOne({ email: logInData.email });
    if (!foundUser) throw new WrongCredentialsException();
    // Check if the password is correct
    const isPasswordMatching = await compare(logInData.password, foundUser.password);
    if (!isPasswordMatching) throw new WrongCredentialsException();
    // Crating a token and sending to the user
    const token = this.createToken(foundUser);
    foundUser.tokens.push({ token });
    const updatedUser = await this.user.findByIdAndUpdate(foundUser._id, foundUser, {
      new: true
    });
    if (!updatedUser) throw new UserNotFoundException(foundUser._id);
    foundUser.password = undefined;
    return { foundUser, token };
  }

  public createToken(user: User) {
    const expiresIn = 3600; // an hour
    const secret = process.env.SECRET_TOKEN;
    const dataStoreInToken: dataStoreInToken = {
      _id: user._id
    };
    return sign(dataStoreInToken, secret, { expiresIn });
  }
}

export default AuthenticationService;
