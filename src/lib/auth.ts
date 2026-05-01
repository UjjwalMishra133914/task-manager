import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, SECRET) as {
      id: string;
      role: string;
    };

    return decoded;
  } catch (error) {
    console.log("TOKEN ERROR ❌", error);
    return null;
  }
};