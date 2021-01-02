import App from './index';
import UserController from './controllers/Users/user.controller';

import validateEnv from './utils/validateEnv';

validateEnv();

const Controllers = [new UserController()];

const app = new App(Controllers);

app.connectToTheDataBase();
