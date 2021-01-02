import express from 'express';

import Controller from '../../interfaces/controller.interface';
import UserModel from './user.model';

class UserController implements Controller {
  public path: string = '/users';
  public router: express.Router = express.Router();
  private user = UserModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
  }

  getAllUsers = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const users = await this.user.find();
    if (!users) return res.status(404).json({ message: 'Users not found!' });
    return res.status(200).json(users);
  };
}

export default UserController;

// getPostById = async (req: Request, res: Response, next: NextFunction) => {
//   const id = req.params.id;
//   const post = await postModel.findById(id);
//   if (post) {
//     return res.status(200).json(post);
//   } else {
//     next(new PostNotFoundException(+id));
//   }
// };

// modifyPost = async (req: Request, res: Response, next: NextFunction) => {
//   const id = req.params.id;
//   const postData: PostInterface = req.body;
//   const modifiedPost = await postModel.findByIdAndUpdate(id, postData, { new: true });
//   if (modifiedPost) {
//     return res.status(201).json({
//       message: 'Post updated successfully!',
//       post: modifiedPost
//     });
//   } else {
//     next(new PostNotFoundException(+id));
//   }
// };

// createAPost = async (req: RequestWithUser, res: Response) => {
//   const postData: PostInterface = req.body;
//   const createdPost = new postModel({
//     ...postData,
//     author: req.user._id,
//   });
//   const savedPost = await createdPost.save();
//   await savedPost.populate('author', '-password -createdAt -updatedAt').execPopulate();
//   return res.status(201).json({
//     message: 'Post created successfully!',
//     Post: savedPost
//   });
// };

// deletePost = async (req: Request, res: Response, next: NextFunction) => {
//   const id = req.params.id;
//   const deletedPost = await postModel.findByIdAndDelete(id);
//   if (deletedPost) {
//     return res.status(200).json({
//       message: 'Post deleted successfully!'
//     });
//   } else {
//     next(new PostNotFoundException(+id));
//   }
// };
// }
