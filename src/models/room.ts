import { Schema } from "mongoose";
import BaseModel from "../base/model";
import type RoomAttributes from "../interfaces/room";

export default new (class Room extends BaseModel<RoomAttributes> {
  constructor() {
    super(
      "Room",
      new Schema({
        type: {
          type: String,
          required: true,
          enum: ["Private", "Group"],
        },
        users: [
          {
            userId: String,
            addedAt: Date,
            role: String,
          },
        ],
        description: {
          type: String,
          default: null,
        },
        image: {
          type: String,
          required: false,
        },
        imageId: {
          type: String,
          required: false,
        },
        name: {
          type: String,
        },
        owner: {
          type: String,
        },
        chats: [
          {
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
            mediaType: {
              type: String,
              enum: ["image", "video"],
              required: false,
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
            createdAt: {
              type: Date,
            },
            updatedAt: {
              type: Date,
            },
          },
        ],
      })
    );
  }
})().model;
