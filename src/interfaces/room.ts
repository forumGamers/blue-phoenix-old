import type { BaseDocument } from "../base/model";
import type ChatAttributes from "./chat";
import { Types } from "mongoose";

export default interface RoomAttributes extends BaseDocument {
  type: RoomType;
  users: RoomUser[];
  description?: string;
  image?: string;
  imageId?: string;
  name: string;
  owner: string;
  chats: ChatAttributes[];
}

export type RoomType = "Private" | "Group";

export interface RoomUser {
  userId: string;
  addedAt: Date;
  role: RoomRole;
}

export interface CreateRoomInput {
  users: string[];
  description?: string;
  name?: string;
}

export interface Room {
  type: RoomType;
  users: RoomUser[];
  description?: string;
  image?: string;
  imageId?: string;
  name: string;
  owner: string;
  chats: ChatAttributes[];
}

export type RoomRole = "Admin" | "Member";

export interface ListRoom {
  name?: string;
  type: RoomType;
  users: string[];
  chats: ChatAttributes[];
  _id: Types.ObjectId;
  image: string;
}
