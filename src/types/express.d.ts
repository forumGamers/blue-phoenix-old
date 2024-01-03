declare global {
  namespace Express {
    interface Request {
      user: {
        UUID: string;
        loggedAs: "User" | "Admin";
      };
    }
  }
}

export {};
