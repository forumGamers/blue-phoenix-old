import * as yup from "yup";
import BaseValidation from "../base/validation";
import { MulterFile } from "../interfaces";

export default new (class ChatValidator extends BaseValidation {
  constructor() {
    super();
  }

  public async validateImage(data: any) {
    return await this.validate<MulterFile | undefined>(
      yup.object(this.mediaChatValidator).optional(),
      data
    );
  }

  public async validateCreateChat(data: any) {
    return await this.validate<{ message: string }>(
      yup.object().shape({
        message: yup.string().optional(),
      }),
      data
    );
  }

  public async validateSetReadStatus(data: any) {
    return await this.validate<{ chatIds: string[] }>(
      yup.object().shape({
        chatIds: yup
          .array()
          .of(yup.string().required("chatId is required"))
          .required("chatIds is required")
          .min(1, "min input 1 chatId"),
      }),
      data
    );
  }

  public async validateEditMsg(data: any) {
    return await this.validate<{ message: string }>(
      yup.object().shape({
        message: yup.string().required("please input edited message"),
      }),
      data
    );
  }
})();
