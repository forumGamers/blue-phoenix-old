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
}

export type ChatStatus = "plain" | "updated" | "deleted";

export type ChatMediaType = "image" | "video";
