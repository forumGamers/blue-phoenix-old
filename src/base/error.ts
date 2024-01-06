import GlobalConstant from "../constant";

export interface AppErrorConstructor {
  message: string;
  statusCode: number;
  data?: any;
}

export default class AppError extends Error {
  public statusCode: number;
  public data?: any;
  constructor({ message, statusCode, data }: AppErrorConstructor) {
    super(message);

    Object.setPrototypeOf(this, AppError.prototype);
    this.data = data;
    this.statusCode = statusCode;
    this.name = GlobalConstant.responseName[this.statusCode];
  }
}

export interface ApplicationError extends Error {
  statusCode: number;
  data?: any;
}
