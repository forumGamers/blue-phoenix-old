import type { NextFunction, Request, Response } from "express";
import roomRepo from "../../repository/room";
import AppError from "../../base/error";
import response from "../../middlewares/response";
import Helper from "../../helpers";
import { Types } from "mongoose";
import room from "../../models/room";

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

      const data = await roomRepo.getUserRoom(UUID, (page - 1) * limit, limit);

      if (!data.length)
        throw new AppError({ message: "data not found", statusCode: 404 });

      response(
        {
          res,
          code: 200,
          message: "OK",
          data: {
            Group: data
              .filter((el) => el._id === "Group")
              .map((el) => ({
                ...el,
                data: Helper.decryptChats(el.data),
              })),
            Private: data
              .filter((el) => el._id === "Private")
              .map((el) => ({
                ...el,
                data: Helper.decryptChats(el.data),
              })),
          },
        },
        {
          totalData: data[0].total,
          limit,
          page,
          totalPage: Math.ceil(data[0].total / limit),
        }
      );
    } catch (err) {
      next(err);
    }
  }

  public static async getRoomById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { roomId } = req.params;
      const { UUID } = req.user;
      const roomObjectId = new Types.ObjectId(roomId);

      const data = await room.findById(roomObjectId);
      if (!data)
        throw new AppError({ message: "data not found", statusCode: 404 });

      if (!data.users.find((el) => el.userId === UUID))
        throw new AppError({ message: "Forbidden", statusCode: 403 });

      response({
        res,
        code: 200,
        message: "ok",
        data: {
          ...(data as any)._doc,
          chats: undefined,
          media: data.chats
            .filter(
              (el) =>
                el.mediaType &&
                el.image &&
                el.imageId &&
                el.status !== "deleted"
            )
            .map((el) => ({
              image: el.image,
              imageId: el.imageId,
              mediaType: el.mediaType,
              senderId: el.senderId,
            })),
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
