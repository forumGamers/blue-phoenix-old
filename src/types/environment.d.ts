declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      IMAGEKIT_PUBLIC_KEY: string;
      IMAGEKIT_PRIVATE_KEY: string;
      IMAGEKIT_ENDPOINT_URL: string;
      CORS_LIST: string;
      SECRET: string;
      ENCRYPTION_KEY: string;
    }
  }
}

export {};
