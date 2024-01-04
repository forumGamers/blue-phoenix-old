import type { NextFunction, Request, Response } from "express";
import AppError, { ApplicationError } from "../base/error";
import response from "./response";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

class ErrorHandler {
  public errorHandling(
    err: ApplicationError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    let message =
      err instanceof AppError ? err.message : "Internal Server Error";
    let code =
      err instanceof AppError ? (err as ApplicationError).statusCode : 500;

    if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
      code = 401;
      message = "Invalid Token";
    }

    const payload: any = {
      res,
      code,
      message,
    };
    if ((err as ApplicationError).data)
      payload.data = (err as ApplicationError).data;

    if (code === 500) console.log(err);

    response(payload);
  }
}

export default new ErrorHandler().errorHandling;
