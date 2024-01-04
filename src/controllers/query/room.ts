import type { NextFunction, Request, Response } from "express";
import roomRepo from "../../repository/room";
import AppError from "../../base/error";
import response from "../../middlewares/response";

export default abstract class RoomQueryController {
  public static async getUserRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { UUID } = req.user;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 15;

      const [{ data, total = 0 }] = await roomRepo.getUserRoom(
        UUID,
        (page - 1) * limit,
        limit
      );

      if (!total)
        throw new AppError({ message: "data not found", statusCode: 404 });

      response(
        { res, code: 200, message: "OK", data },
        {
          totalData: total,
          limit,
          page,
          totalPage: Math.ceil(total / limit),
        }
      );
    } catch (err) {
      next(err);
    }
  }
}
