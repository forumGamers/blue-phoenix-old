import { Response } from "express";
import GlobalConstant from "../constant";

type ResponsePayload = {
  data?: any;
  message?: string;
  res: Response<any, Record<string, any>>;
  code: number;
};

type ResponseDetail = {
  totalData: number;
  limit: number;
  page: number;
  totalPage: number;
  [key: string]: any;
};

class ResponseHandler {
  private baseResponse({
    code,
    message,
    data,
  }: {
    code: number;
    message?: string;
    data?: any;
  }): Record<string, any> {
    return {
      statusCode: code,
      status: GlobalConstant.responseName[code ?? 500],
      message,
      data,
    };
  }
  public async createResponse(
    payload: ResponsePayload,
    detail?: ResponseDetail
  ) {
    const { code, message, res, data } = payload;
    const response = this.baseResponse({ code, message, data });

    if (detail) for (const key in detail) response[key] = detail[key];
    response["Content-Type"] = res.req.headers["content-type"];
    response["Path"] = `${res.req.method} ${res.req.originalUrl}`;

    res.status(code).json(response);
  }
}

export default new ResponseHandler().createResponse.bind(new ResponseHandler());
