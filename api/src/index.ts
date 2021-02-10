import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';

import Controller from './interfaces/controller.interface';

import errorMiddleware from './middlewares/error.middleware';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorMiddleware();
  }

  public getServer() {
    return this.app;
  }

  private listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  }

  private initializeMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private initializeErrorMiddleware() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller: Controller) => {
      this.app.use('/api', controller.router);
    });
  }

  public connectToTheDataBase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_URI } = process.env;
    mongoose
      .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_URI}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      .then(() => {
        this.listen();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export default App;
