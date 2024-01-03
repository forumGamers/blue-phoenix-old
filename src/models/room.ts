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
        role: [
          {
            userId: String,
            role: String,
          },
        ],
        owner: {
          type: String,
        },
      })
    );
  }
})().model;
