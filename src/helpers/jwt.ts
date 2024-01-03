import { JwtPayload, Secret, sign, SignOptions, verify } from "jsonwebtoken";

export interface jwtValue extends JwtPayload {
  UUID: string;
  loggedAs: "User" | "Admin";
}

export default new (class JWT {
  private secret: Secret;

  constructor() {
    this.secret = process.env.SECRET as Secret;
  }

  public createToken(
    data: { UUID: string; loggedAs: "User" | "Admin" },
    options?: SignOptions
  ) {
    return sign({ ...data }, this.secret, options);
  }

  public verifyToken<T = jwtValue>(token: string) {
    return verify(token, this.secret) as T;
  }
})();
