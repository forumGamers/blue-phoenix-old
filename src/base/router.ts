import { NextFunction, Request, Response, Router } from "express";
import IRoutes from "../interfaces/router";
import AppError from "./error";

export default abstract class BaseRoutes implements IRoutes {
  public router: Router;

  abstract routes(): void;

  constructor() {
    this.router = Router();
    this.routes();
  }

  protected NotFoundRoutes(
    req: Request,
    _: Response,
    next: NextFunction
  ): void {
    next(
      new AppError({
        message: `Cannot ${req.method} ${req.originalUrl}`,
        statusCode: 404,
      })
    );
  }
}
