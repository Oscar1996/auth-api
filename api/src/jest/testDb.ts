import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import userModel from '../Users/user.model';
import postModel from '../Posts/post.model';
import { hash } from 'bcryptjs';

const user = userModel;
const post = postModel;

const userOneId = new mongoose.Types.ObjectId();
export const userOne = {
  _id: userOneId,
  firstName: 'testName',
  lastName: 'testLastName',
  email: 'oscarx196@gmail.com',
  password: 'holaquetal',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.SECRET_TOKEN, { expiresIn: 3600 })
    }
  ]
};

const userTwoId = new mongoose.Types.ObjectId();
export const userTwo = {
  _id: userTwoId,
  firstName: 'testName',
  lastName: 'testLastName',
  email: 'test2@example.com',
  password: 'xdxdxd',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.SECRET_TOKEN, { expiresIn: 3600 })
    }
  ]
};

export const postOne = {
  _id: new mongoose.Types.ObjectId(),
  author: userOne._id,
  content: 'Some content for postOne',
  title: 'Title 1'
};

export const postTwo = {
  _id: new mongoose.Types.ObjectId(),
  author: userOne._id,
  content: 'Some content for postTwo',
  title: 'Title 2'
};

export const postThree = {
  _id: new mongoose.Types.ObjectId(),
  author: userTwo._id,
  content: 'Some content for postThree',
  title: 'Title 3'
};

export const setupDatabase = (customUrl: string) => async () => {
  const { MONGO_USER, MONGO_PASSWORD } = process.env;
  const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${customUrl}`;
  const h1 = await hash(userOne.password, 12);
  const h2 = await hash(userTwo.password, 12);
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
  await new user({ ...userOne, password: h1 }).save();
  await new user({ ...userTwo, password: h2 }).save();
  await new post(postOne).save();
  await new post(postTwo).save();
  await new post(postThree).save();
};

export const endDatabase = async () => {
  await user.deleteMany();
  await post.deleteMany();
  await mongoose.connection.close();
};
