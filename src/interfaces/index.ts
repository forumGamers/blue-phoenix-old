export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  filename: string;
}

export type ResponseDataWithTotal<T = any> = {
  data: T[];
  total: number;
};
