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
    next: NextFunction
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

      payload.createdAt = new Date()
      payload.updatedAt = new Date()
      await room.updateOne({ _id: roomObjectId },{
        $push:{
            chats:payload
        }
      });

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
