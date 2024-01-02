import BaseRoutes from "../base/router";

export default new (class NotFoundRoutes extends BaseRoutes {
  routes(): void {
    this.router.use("/*", this.NotFoundRoutes);
  }
})().router;
