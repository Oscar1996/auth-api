import App from './index';
import UserController from './Users/user.controller';
import PostController from './Posts/post.controller';
import AuthController from './authentication/authentication.controller';
import ReportController from './reports/report.controller';

import validateEnv from './utils/validateEnv';

validateEnv();

const Controllers = [new UserController(), new PostController(), new AuthController(), new ReportController()];

const app = new App(Controllers);

app.connectToTheDataBase();
