import { Request, Response, Router } from 'express';

import postModel from './post.model';
import Controller from '../../interfaces/controller.interface';
import Post from './post.interface';

class PostController implements Controller {
  public path: string = '/posts';
  public router: Router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}:id`, this.getPostById);
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createPost);
    this.router.patch(`${this.path}:id`, this.updatePost);
    this.router.delete(`${this.path}:id`, this.deletePost);
  }

  private getPostById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const post = await this.post.findById(id);
    if (!post) res.status(404).json({ message: 'Post not found!' });
    res.status(200).json(post);
  };

  private getAllPosts = async (req: Request, res: Response) => {
    const posts = await this.post.find();
    if (!posts) res.status(404).json({ message: 'Posts not found!' });
    res.status(200).json(posts);
  };

  private updatePost = async (req: Request, res: Response) => {
    const id = req.params.id;
    const postData: Post = req.body;
    const updatedPost = await this.post.findByIdAndUpdate(id, postData, {
      new: true
    });
    if (!updatedPost) res.status(400).json({ message: 'Post not updated!' });
    res.status(200).json(updatedPost);
  };

  private createPost = async (req: Request, res: Response) => {
    const postData: Post = req.body;
    const createdPost = new this.post(postData);
    const savedPost = await createdPost.save();
    if (!savedPost) res.status(204).json({ message: 'Not content!' });
    res.status(201).json(savedPost);
  };

  private deletePost = async (req: Request, res: Response) => {
    const id = req.params.id;
    const deletedPost = await this.post.findByIdAndDelete(id);
    if (!deletedPost) res.status(404).json({ message: 'Post not found!' });
    res.status(200).json(deletedPost);
  };
}

export default PostController;
