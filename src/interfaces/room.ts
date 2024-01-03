import type { BaseDocument } from "../base/model";

export default interface RoomAttributes extends BaseDocument {
  type: "Private" | "Group";
  users: {
    userId: string;
    addedAt: Date;
  }[];
  description?: string;
  image?: string;
  imageId?: string;
  name: string;
  role: {
    userId: string;
    role: "Admin" | "Member";
  }[];
  owner: string;
}

export type RoomType = "Private" | "Group";

export interface CreateRoomInput {
  users: string[];
  description?: string;
  name?: string;
}

export interface Room {
  type: "Private" | "Group";
  users: {
    userId: string;
    addedAt: Date;
  }[];
  description?: string;
  image?: string;
  imageId?: string;
  name: string;
  role: {
    userId: string;
    role: "Admin" | "Member";
  }[];
  owner: string;
}
