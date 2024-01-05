import type { NextFunction, Request, Response } from "express";
import roomValidator from "../../validations/room";
import { readFileSync, unlinkSync } from "fs";
import { uploadImg } from "../../lib/imagekit";
import GlobalConstant from "../../constant";
import type { Room } from "../../interfaces/room";
import room from "../../models/room";
import response from "../../middlewares/response";
import AppError from "../../base/error";
import { Types, UpdateQuery } from "mongoose";

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
      payload.chats = [];

      response({
        res,
        code: 201,
        message: "success",
        data: await room.create(payload),
      });
    } catch (err) {
      next(err);
    } finally {
      if (file) unlinkSync(filePath);
    }
  }

  public static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { UUID } = req.user;
      const { userId, roomId } = req.params;

      if (UUID === userId)
        throw new AppError({ message: "cannot self delete", statusCode: 400 });

      const roomObjectId = new Types.ObjectId(roomId);

      const data = await room.findById(roomObjectId);
      if (!data)
        throw new AppError({ message: "Data not found", statusCode: 404 });

      if (
        data.role.find((el) => el.userId === UUID)?.role !== "Admin" ||
        data.owner !== UUID ||
        data.type === "Private"
      )
        throw new AppError({ message: "Forbidden", statusCode: 403 });

      const user = data.users.find((user) => user.userId === userId);
      if (!user)
        throw new AppError({ message: "User not found", statusCode: 404 });

      if (
        data.role.find((el) => el.userId === user.userId)?.role === "Admin" &&
        data.owner !== UUID
      )
        throw new AppError({ message: "Cannot delete admin", statusCode: 403 });

      await room.updateOne(
        { _id: roomObjectId },
        {
          $pull: {
            users: {
              userId,
            },
            role: {
              userId,
            },
          },
        }
      );

      response({
        res,
        code: 200,
        message: "success",
      });
    } catch (err) {
      next(err);
    }
  }

  public static async leaveRoom(
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

      const query: UpdateQuery<Room> = {
        $pull: {
          users: {
            userId: UUID,
          },
          role: {
            userId: UUID,
          },
        },
      };

      if (data.owner === UUID) {
        for (let i = data.role.length - 1; i >= 0; i--)
          if (data.role[i].role === "Admin") {
            query.$set = {
              owner: data.role[i].userId,
            };
            break;
          }

        if (!query.$set)
          throw new AppError({
            message: "please set a admin first",
            statusCode: 400,
          });
      }

      await room.updateOne({ _id: roomObjectId }, query);

      response({
        res,
        code: 200,
        message: "success",
      });
    } catch (err) {
      next(err);
    }
  }
}
