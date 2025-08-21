import express, { Application } from "express";
// import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import Controller from "./utils/interfaces/controller.interface";
import { errorMiddleware } from "./middleware/error.middleware";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import createAdmin from "./utils/helpers/createAdmin";
// import { beaconLoggerMiddleware } from "./middleware/logger.middleware";

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.initialiseDatabaseConnection();
  }

  private initializeMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors({ origin: true, credentials: true }));
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    // this.express.use(compression());
    this.express.use(cookieParser());
    // this.express.use(beaconLoggerMiddleware);
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use("/api/v1", controller.router);
    });
  }

  private initializeErrorHandling(): void {
    this.express.use(errorMiddleware);
  }

  private initialiseDatabaseConnection(): void {
    // const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

    // mongoose.connect(
    //     `mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
    // );

    mongoose
      .connect("mongodb://localhost:27017", { dbName: "people-tracking-1-2" })
      .then(async () => await createAdmin());
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
