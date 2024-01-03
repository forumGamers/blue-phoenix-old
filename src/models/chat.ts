import { Schema } from "mongoose";
import BaseModel from "../base/model";
import type ChatAttributes from "../interfaces/chat";

export default new (class Chat extends BaseModel<ChatAttributes> {
  constructor() {
    super(
      "Chat",
      new Schema({
        senderId: {
          type: String,
          required: true,
        },
        message: {
          type: String,
        },
        image: {
          type: String,
          required: false,
        },
        imageId: {
          type: String,
          required: false,
        },
        roomId: {
          type: Schema.Types.ObjectId,
          require: true,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
          enum: ["plain", "updated", "deleted"],
          default: "plain",
        },
      })
    );
  }
})().model;
