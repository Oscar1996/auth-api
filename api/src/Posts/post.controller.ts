import { Response, NextFunction, Router } from 'express';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import authenticationMiddleware from '../middlewares/authentication.middleware';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Post from './post.interface';
import postModel from './post.model';
import CreatePostDto from './post.dto';

class PostController implements Controller {
  public path: string = '/posts';
  public router: Router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, authenticationMiddleware, this.getAllPosts);
    this.router.get(`${this.path}/:id`, authenticationMiddleware, this.getPostById);
    this.router.post(this.path, authenticationMiddleware, validationMiddleware(CreatePostDto), this.createPost);
    this.router.patch(
      `${this.path}/:id`,
      authenticationMiddleware,
      validationMiddleware(CreatePostDto, true),
      this.updatePost
    );
    this.router.delete(`${this.path}/:id`, authenticationMiddleware, this.deletePost);
  }

  private getAllPosts = async (req: RequestWithUser, res: Response) => {
    const posts = await this.post
      .find({ author: req.user._id })
      .populate('author', '-password -tokens -createdAt -updatedAt');
    if (posts.length === 0) return res.status(404).json({ message: 'Posts not found!' });
    return res.status(200).json(posts);
  };

  private getPostById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const post = await this.post.find({ author: req.user._id, _id: id }).populate('author', '-password -tokens');
    if (!post) return next(new PostNotFoundException(id));
    return res.status(200).json(post);
  };

  private createPost = async (req: RequestWithUser, res: Response) => {
    const postData: CreatePostDto = req.body;
    const createdPost = new this.post({ ...postData, author: req.user._id });
    const savedPost = await createdPost.save();
    if (!savedPost) return res.status(204).json({ message: 'Post not created' });
    return res.status(201).json(savedPost);
  };

  private updatePost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const postData: Post = req.body;
    const updatedPost = await this.post.updateOne({ author: req.user.id, _id: id }, postData, { new: true });
    if (!updatedPost) return next(new PostNotFoundException(id));
    return res.status(200).json(updatedPost);
  };

  private deletePost = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const deletedPost = await this.post.deleteOne({ author: req.user._id, _id: id });
    if (!deletedPost) return next(new PostNotFoundException(id));
    return res.status(200).json(deletedPost);
  };
}

export default PostController;
