import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";
import type { Application } from "express";
import { UserRouter } from "./router/UserRouter";
import { connectDB } from "./db/mongo";
import { WorkSpaceRouter } from "./router/WorkSpaceRouter";
import { TaskRouter } from "./router/TaskRouter";

class ServerApp {
  public app: Application = express();
  private port: number = 4000;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    await this.dataBase();
    this.middlewares();
    this.httpRoutes();
    this.listen();
  }

  private async dataBase() {
    await connectDB();
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(json())
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
    this.app.use(cors());
  }

  routers(): Array<express.Router> {
    return [
      new UserRouter().router,
      new WorkSpaceRouter().router,
      new TaskRouter().router
    ];
  }

  private httpRoutes() {
    this.app.use('/api', this.routers());
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log("Server listening on port " + this.port);
    });
  }
}

new ServerApp();