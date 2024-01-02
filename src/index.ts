import express, { Application } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import { format, utcToZonedTime } from "date-fns-tz";
import AppError from "./base/error";
import GlobalConstant from "./constant";
import router from "./routes";
import notfound from "./routes/notfound";
import errorHandler from "./middlewares/errorHandler";

export default new (class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.plugins();
    this.routes();
    this.errorHandling();
  }

  private plugins(): void {
    this.app.use(
      helmet({
        referrerPolicy: { policy: "same-origin" },
      })
    );
    this.app.use(
      cors({
        origin(requestOrigin, callback) {
          const whiteList = process.env.CORS_LIST ?? "";
          if (whiteList.indexOf(requestOrigin as string) !== -1) {
            callback(null, true);
          } else {
            callback(
              new AppError({
                message: `Not allowed by CORS for URL ${requestOrigin}`,
                statusCode: 403,
              })
            );
          }
        },
      })
    );
    morgan.token("date", () =>
      format(
        utcToZonedTime(new Date(), "Asia/Jakarta"),
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      )
    );
    morgan.format(
      "production",
      '[:date[Asia/Jakarta]] ":method :url" :status :res[content-length] - :response-time ms'
    );
    morgan.format(
      "dev",
      '[:date[Asia/Jakarta]] ":method :url" :status :res[content-length] - :response-time ms'
    );
    this.app.use(morgan("combined"));
    this.app.use(express.static("public"));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: true,
        limit: "50mb",
        parameterLimit: 100000000,
      })
    );
    this.app.disable("x-powered-by");
  }

  private routes() {
    this.app.use(GlobalConstant.baseUrl, router).use(notfound);
  }

  private errorHandling() {
    this.app.use(errorHandler);
  }
})().app;
