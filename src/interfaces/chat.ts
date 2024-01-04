export default interface ChatAttributes {
  senderId: string;
  message?: string;
  image?: string;
  imageId?: string;
  isRead: boolean;
  status: "plain" | "updated" | "deleted";
}
