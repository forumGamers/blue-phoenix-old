import GlobalConstant from "../constant";

export default class AppError extends Error {
  public statusCode: number;
  public data?: any;
  constructor({
    message,
    statusCode,
    data,
  }: {
    message: string;
    statusCode: number;
    data?: any;
  }) {
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
