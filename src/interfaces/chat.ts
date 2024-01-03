import { Types } from "mongoose";
import type { BaseDocument } from "../base/model";

export default interface ChatAttributes extends BaseDocument {
  senderId: string;
  message?: string;
  image?: string;
  imageId?: string;
  isRead: boolean;
  status: "plain" | "updated" | "deleted";
  roomId: Types.ObjectId;
}
