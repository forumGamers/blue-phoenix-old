import BaseRoutes from "../base/router";
import ChatCmdController from "../controllers/cmd/chat";
import checkValidParamObjectId from "../middlewares/isValidObjectId";
import multer from "../middlewares/multer";

export default new (class ChatRouter extends BaseRoutes {
  routes(): void {
    this.router
      .post(
        "/:roomId",
        multer.single("file"),
        checkValidParamObjectId("roomId"),
        ChatCmdController.createChat
      )
      .patch(
        "/:roomId/read-status",
        checkValidParamObjectId("roomId"),
        ChatCmdController.setRead
      )
      .patch(
        "/:roomId/:chatId/message",
        checkValidParamObjectId("roomId"),
        checkValidParamObjectId("chatId"),
        ChatCmdController.editMsg
      );
  }
})().router;
