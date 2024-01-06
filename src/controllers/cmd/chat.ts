import type { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import room from "../../models/room";
import AppError from "../../base/error";
import chatValidator from "../../validations/chat";
import GlobalConstant from "../../constant";
import ChatAttributes, { type ChatMediaType } from "../../interfaces/chat";
import encryption from "../../helpers/encryption";
import { uploadImg } from "../../lib/imagekit";
import { readFileSync, unlinkSync } from "fs";
import response from "../../middlewares/response";

export default abstract class ChatCmdController {
  public static async createChat(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    let file = null;
    let filePath = "";
    try {
      const { roomId } = req.params;
      const { UUID } = req.user;
      const roomObjectId = new Types.ObjectId(roomId);
      const { message } = await chatValidator.validateCreateChat(req.body);

      if (!message && !req.file)
        throw new AppError({
          message: "please input message or file",
          statusCode: 400,
        });

      const data = await room.findById(roomObjectId);
      if (!data)
        throw new AppError({ message: "room is not found", statusCode: 404 });

      if (!data.users.find((el) => el.userId === UUID))
        throw new AppError({ message: "unauthorized", statusCode: 401 });

      const payload: ChatAttributes = {
        message: encryption.encrypt(message),
        senderId: UUID,
        isRead: false,
        status: "plain",
      } as ChatAttributes;

      if (req.file) {
        file = await chatValidator.validateImage(req.file);
        filePath = `${GlobalConstant.uploadDirr}/${file?.filename}`;

        if (file) {
          const { url, fileId } = await uploadImg({
            fileName: file.filename,
            folder: "chat",
            path: readFileSync(filePath),
          });
          const [type] = file.mimetype.split("/");
          payload.image = url;
          payload.imageId = fileId;
          payload.mediaType = type.toLowerCase() as ChatMediaType;
        }
      }

      payload.createdAt = new Date();
      payload.updatedAt = new Date();
      await room.updateOne(
        { _id: roomObjectId },
        {
          $push: {
            chats: payload,
          },
        },
      );

      response({
        res,
        code: 200,
        message: "success",
      });
    } catch (err) {
      next(err);
    } finally {
      if (file) unlinkSync(filePath);
    }
  }

  public static async setRead(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { roomId } = req.params;
      const { UUID } = req.user;
      const { chatIds } = await chatValidator.validateSetReadStatus(req.body);
      const roomObjectId = new Types.ObjectId(roomId);

      const data = await room.findById(roomObjectId);
      if (!data)
        throw new AppError({ message: "room not found", statusCode: 404 });

      const query: any = {
        $set: {},
      };

      for (const chatId of chatIds) {
        const idx = data.chats.findIndex((el) => el._id.toString() === chatId);
        if (idx !== -1 && data.chats[idx].senderId !== UUID)
          query.$set[`chats.${idx}.isRead`] = true;
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

  public static async editMsg(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { roomId, chatId } = req.params;
      const { UUID } = req.user;
      const { message } = await chatValidator.validateEditMsg(req.body);
      const roomObjectId = new Types.ObjectId(roomId);

      const data = await room.findById(roomObjectId);
      if (!data)
        throw new AppError({ message: "room not found", statusCode: 404 });

      const chatIdx = data.chats.findIndex(
        (el) => el._id.toString() === chatId,
      );
      if (chatIdx === -1)
        throw new AppError({ message: "chat not found", statusCode: 404 });

      if (data.chats[chatIdx].senderId !== UUID)
        throw new AppError({ message: "Forbidden", statusCode: 403 });

      await room.updateOne(
        { _id: roomObjectId },
        {
          $set: {
            [`chats.${chatIdx}.message`]: encryption.encrypt(message),
            [`chats.${chatIdx}.status`]: "updated",
          },
        },
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

  public static async hideMsg(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { roomId, chatId } = req.params;
      const { UUID } = req.user;
      const roomObjectId = new Types.ObjectId(roomId);

      const data = await room.findById(roomObjectId);
      if (!data)
        throw new AppError({ message: "room not found", statusCode: 404 });

      const chatIdx = data.chats.findIndex(
        (el) => el._id.toString() === chatId,
      );
      if (chatIdx === -1)
        throw new AppError({ message: "chat not found", statusCode: 404 });

      if (data.chats[chatIdx].senderId !== UUID)
        throw new AppError({ message: "Forbidden", statusCode: 403 });

      if (data.chats[chatIdx].status === "deleted")
        throw new AppError({ message: "Conflict", statusCode: 409 });

      await room.updateOne(
        { _id: roomObjectId },
        {
          $set: {
            [`chats.${chatIdx}.status`]: "deleted",
          },
        },
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
}
