import BaseRoutes from "../base/router";
import roomRoutes from "./room";

export default new (class Router extends BaseRoutes {
  routes(): void {
    this.router.use("/room", roomRoutes);
  }
})().router;
