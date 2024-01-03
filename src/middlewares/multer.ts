import multer from "multer";
import type { MulterFile } from "../interfaces";
import type { Request } from "express";

export default multer({
  storage: multer.diskStorage({
    destination: (req: Request, file: MulterFile, cb: Function) => {
      cb(null, "./uploads");
    },
    filename: (req: Request, file: MulterFile, cb: Function) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});
