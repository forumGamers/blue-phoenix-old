import BaseValidation from "../base/validation";
import type { MulterFile } from "../interfaces";
import type { CreateRoomInput } from "../interfaces/room";
import * as yup from "yup";

export default new (class RoomValidator extends BaseValidation {
  constructor() {
    super();
  }

  public async validateCreateRoom(data: any) {
    return await this.validate<CreateRoomInput>(
      yup.object().shape({
        users: yup
          .array()
          .required("users is required")
          .transform((val: string) => val.split(","))
          .of(yup.string().uuid("invalid uuid"))
          .min(1)
          .test("unique value", "value must be unique", (val) =>
            !val ? true : new Set(val).size === val.length
          ),
        description: yup.string().optional().default(""),
        name: yup.string().optional(),
      }),
      data
    );
  }

  public async validateImage(data: any) {
    return await this.validate<MulterFile | undefined>(
      yup.object(this.imageValidator).optional(),
      data
    );
  }
})();
