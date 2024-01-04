import type { NextFunction, Request, Response } from "express";
import AppError from "../base/error";
import { isValidObjectId } from "mongoose";

export default function checkValidParamObjectId(field: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const param = req.params[field];
      if (!param)
        throw new AppError({
          message: "Internal Server Error",
          statusCode: 500,
        });

      if (!isValidObjectId(param))
        throw new AppError({ message: "Invalid ObjectId", statusCode: 400 });

      next();
    } catch (err) {
      next(err);
    }
  };
}
