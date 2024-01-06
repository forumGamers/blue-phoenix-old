import * as yup from "yup";
import AppError from "./error";
import GlobalConstant from "../constant";

export default abstract class BaseValidation {
  protected async validate<T>(schema: yup.Schema, data: any): Promise<T> {
    try {
      return (await schema.validate(data, {
        stripUnknown: true,
        abortEarly: false,
      })) as T;
    } catch (err) {
      const { errors } = err as { errors: string[] };

      throw new AppError({
        message: errors.length ? errors.join(",\n ") : errors[0],
        statusCode: 400,
      });
    }
  }

  protected passwordValidation(password: string) {
    const requirements = [
      {
        regex: /(?=.*[a-z])/,
        message: "please input min 1 lowercase",
      },
      {
        regex: /(?=.*[A-Z])/,
        message: "please input min 1 uppercase",
      },
      {
        regex: /(?=.*\d)/,
        message: "please input min 1 number",
      },
      {
        regex: /(?=.*[!@#$%^&*])/,
        message: "please input min 1 number",
      },
      { regex: /^.{8,}$/, message: "min character length is 8" },
    ];
    const errors = [];

    for (const requirement of requirements)
      if (!requirement.regex.test(password))
        errors.push(new Error(requirement.message).message);

    if (errors.length) throw { errors };

    return true;
  }

  protected imageValidator = {
    fieldname: yup.string(),
    originalname: yup.string(),
    filename: yup.string(),
    encoding: yup.string(),
    buffer: yup.mixed(),
    mimetype: yup
      .string()
      .oneOf(
        GlobalConstant.imageType,
        "image must be oneof .jpg .jpeg .png .gif"
      ),
    size: yup.number().max(10000000, "max file size is 10mb"),
  };

  protected mediaChatValidator = {
    fieldname: yup.string(),
    originalname: yup.string(),
    filename: yup.string(),
    encoding: yup.string(),
    buffer: yup.mixed(),
    mimetype: yup
      .string()
      .oneOf(
        [...GlobalConstant.imageType, ...GlobalConstant.videoType],
        "file type is not supported"
      ),
    size: yup.number().max(10000000, "max file size is 10mb"),
  };

  protected sanitizeForbiddenChar = (val: string, originalVal: string) =>
    originalVal.replace(GlobalConstant.forbiddenChar, "");
}
