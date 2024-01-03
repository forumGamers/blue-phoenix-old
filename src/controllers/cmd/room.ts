import type { NextFunction, Request, Response } from "express";
import roomValidator from "../../validations/room";
import { readFileSync, unlinkSync } from "fs";
import { uploadImg } from "../../lib/imagekit";
import GlobalConstant from "../../constant";
import type { Room } from "../../interfaces/room";
import room from "../../models/room";
import response from "../../middlewares/response";
import AppError from "../../base/error";

export default abstract class RoomCmdController {
  public static async createRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const file = await roomValidator.validateImage(req.file);
    const filePath = `${GlobalConstant.uploadDirr}/${file?.filename}`;
    try {
      const { UUID } = req.user;
      const {
        description,
        name,
        users,
      } = await roomValidator.validateCreateRoom(req.body);
      const payload: Room = {} as Room;

      if (users.length > 1) {
        payload.name = name ?? "No Name";
        payload.description = description ?? "";
        if (file) {
          const { fileId, url } = await uploadImg({
            fileName: file.filename,
            folder: "roomImage",
            path: readFileSync(filePath),
          });

          payload.image = url;
          payload.imageId = fileId;
        }
      }

      payload.type = users.length > 1 ? "Group" : "Private";
      payload.owner = UUID;
      payload.users = [
        ...users
          .map((userId) => ({
            userId,
            addedAt: new Date(),
          }))
          .filter(({ userId }) => userId !== UUID),
        {
          userId: UUID,
          addedAt: new Date(),
        },
      ];

      if (payload.users.length < 2)
        throw new AppError({ message: "There is no user", statusCode: 400 }); //check if user input himself

      payload.role = payload.users.map(({ userId }) => ({
        userId,
        role: userId === UUID && payload.type === "Group" ? "Admin" : "Member",
      }));

      response({
        res,
        code: 201,
        message: "success",
        data: await room.create(payload),
      });
    } catch (err) {
      console.log(err);
      next(err);
    } finally {
      if (file) unlinkSync(filePath);
    }
  }
}
