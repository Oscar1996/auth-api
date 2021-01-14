import App from './index';
import UserController from './Users/user.controller';
import PostController from './Posts/post.controller';
import AuthController from './authentication/authentication.controller';

import validateEnv from './utils/validateEnv';

validateEnv();

const Controllers = [new UserController(), new PostController(), new AuthController()];

const app = new App(Controllers);

app.connectToTheDataBase();
