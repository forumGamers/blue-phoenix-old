import { AES, enc } from "crypto-ts";
import { hashSync, compareSync } from "bcryptjs";

export default new (class Encryption {
  private key: string;
  constructor() {
    this.key = process.env.ENCRYPTION_KEY;
  }

  public encrypt(data: string): string {
    return AES.encrypt(data.replace(/\s/g, "_"), this.key).toString();
  }

  public decrypt(data: string): string {
    return AES.decrypt(data, this.key).toString(enc.Utf8).replace(/_/g, " ");
  }

  public hash(data: string) {
    return hashSync(data, 10);
  }

  public compareEncryption(data: string, hashData: string) {
    return compareSync(data, hashData);
  }
})();
