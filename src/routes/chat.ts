import BaseRoutes from "../base/router";
import ChatCmdController from "../controllers/cmd/chat";
import checkValidParamObjectId from "../middlewares/isValidObjectId";
import multer from "../middlewares/multer";

export default new (class ChatRouter extends BaseRoutes {
  routes(): void {
    this.router
      .use(checkValidParamObjectId("roomId"))
      .post("/:roomId", multer.single("file"), ChatCmdController.createChat)
      .patch("/:roomId/read-status", ChatCmdController.setRead);
  }
})().router;
