import App from './index';
import UserController from './controllers/Users/user.controller';
import PostController from './controllers/Posts/post.controller';

import validateEnv from './utils/validateEnv';

validateEnv();

const Controllers = [new UserController(), new PostController()];

const app = new App(Controllers);

app.connectToTheDataBase();
