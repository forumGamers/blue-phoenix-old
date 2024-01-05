import BaseRoutes from "../base/router";
import RoomCmdController from "../controllers/cmd/room";
import RoomQueryController from "../controllers/query/room";
import checkValidParamObjectId from "../middlewares/isValidObjectId";
import multer from "../middlewares/multer";

export default new (class RoomRoute extends BaseRoutes {
  routes(): void {
    this.router
      .post("/", multer.single("image"), RoomCmdController.createRoom)
      .get("/", RoomQueryController.getUserRoom)
      .delete(
        "/:roomId",
        checkValidParamObjectId("roomId"),
        RoomCmdController.leaveRoom
      )
      .delete(
        "/:roomId/:userId",
        checkValidParamObjectId("roomId"),
        RoomCmdController.deleteUser
      );
  }
})().router;
