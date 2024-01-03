import type { NextFunction, Request, Response } from "express";
import AppError from "../base/error";
import jwt from "../helpers/jwt";

class Authentication {
  public async authentication(req: Request, res: Response, next: NextFunction) {
    try {
      const { UUID, loggedAs } = jwt.verifyToken(this.getToken(req));

      req.user = {
        UUID,
        loggedAs,
      };

      next();
    } catch (err) {
      next(err);
    }
  }

  private getToken(req: Request) {
    const { access_token } = req.headers;
    if (!access_token)
      throw new AppError({ message: "Invalid Token", statusCode: 401 });
    return access_token as string;
  }
}

export default new Authentication().authentication.bind(new Authentication());
