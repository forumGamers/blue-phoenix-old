import BaseRoutes from "../base/router";
import authentication from "../middlewares/authentication";
import roomRoutes from "./room";
import chatRoutes from "./chat";

export default new (class Router extends BaseRoutes {
  routes(): void {
    this.router
      .use(authentication)
      .use("/room", roomRoutes)
      .use("/chat", chatRoutes);
  }
})().router;
