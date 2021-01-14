import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import PostNotFoundException from '../exceptions/PostNorFoundException';
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
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.post(
      this.path,
      validationMiddleware(CreatePostDto),

      this.createPost
    );
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.updatePost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  private getAllPosts = async (_req: Request, res: Response) => {
    const posts = await this.post.find();
    // Empty arrays are truthy
    if (posts.length === 0) return res.status(404).json({ message: 'Posts not found!' });
    res.status(200).json(posts);
  };

  private getPostById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const post = await this.post.findById(id);
    if (!post) return next(new PostNotFoundException(id));
    res.status(200).json(post);
  };

  private createPost = async (req: Request, res: Response) => {
    const postData: Post = req.body;
    const createdPost = new this.post(postData);
    const savedPost = await createdPost.save();
    if (!savedPost) return res.status(204).json({ message: 'Post not created' });
    res.status(201).json(savedPost);
  };

  private updatePost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const postData: Post = req.body;
    const updatedPost = await this.post.findByIdAndUpdate(id, postData, {
      new: true
    });
    if (!updatedPost) return next(new PostNotFoundException(id));
    res.status(200).json(updatedPost);
  };

  private deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const deletedPost = await this.post.findByIdAndDelete(id);
    if (!deletedPost) return next(new PostNotFoundException(id));
    res.status(200).json(deletedPost);
  };
}

export default PostController;
