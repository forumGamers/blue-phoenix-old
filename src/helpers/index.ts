import type { ListRoom } from "../interfaces/room";
import encryption from "./encryption";

export default abstract class Helper {
  public static decryptChats(data: ListRoom[]) {
    return data.map((data) => ({
      ...data,
      chats: data.chats.map((chat) => ({
        ...chat,
        message: chat.message ? encryption.decrypt(chat.message) : "",
      })),
    }));
  }
}
