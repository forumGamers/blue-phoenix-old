import Imagekit from "imagekit";

export type UploadImgProps = {
  path: string | Buffer;
  fileName: string;
  folder: string;
};

const ik = new Imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL,
});

export default ik;

export const uploadImg = async ({ path, fileName, folder }: UploadImgProps) =>
  await ik.upload({
    file: path,
    fileName,
    folder,
  });

export const bulkUploadImg = async (metadata: UploadImgProps[]) =>
  await Promise.all(metadata.map((meta) => uploadImg(meta)));

export const deleteImg = async (imageId: string) =>
  await ik.deleteFile(imageId);
