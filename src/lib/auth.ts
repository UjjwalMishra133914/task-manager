import jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, "SECRET");
  } catch {
    return null;
  }
};