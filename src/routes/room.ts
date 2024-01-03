import BaseRoutes from "../base/router";
import RoomCmdController from "../controllers/cmd/room";
import authentication from "../middlewares/authentication";
import multer from "../middlewares/multer";

export default new (class RoomRoute extends BaseRoutes {
  routes(): void {
    this.router
      .use(authentication)
      .post("/", multer.single("image"), RoomCmdController.createRoom);
  }
})().router;
