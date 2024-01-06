import { Types } from "mongoose";

export default interface ChatAttributes {
  senderId: string;
  message?: string;
  image?: string;
  imageId?: string;
  isRead: boolean;
  status: ChatStatus;
  mediaType?: ChatMediaType;
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
}

export type ChatStatus = "plain" | "updated" | "deleted";

export type ChatMediaType = "image" | "video";
