/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "~/env.mjs";
import jwt from "jsonwebtoken";

export const generateJWT = (data: string | object, option?: object) => {
  const JWT_SECRET_KEY = env.JWT_SECRET_KEY;
  const token = jwt.sign(data, JWT_SECRET_KEY, option);
  return token;
};

export const verifyAndDecodeJWT = (token: string) => {
  const JWT_SECRET_KEY = env.JWT_SECRET_KEY;
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error(
      "Sorry, This invitation is expired. Please contact to host."
    );
  }
};

export const getBaseUrl = () => {
  //SSR should not have window object
  //checking if window have object
  if (typeof window !== "undefined") return "";

  //user is on the server
  if (process.env.FIESTA_URL) {
    return process.env.FIESTA_URL;
  }
  return process.env.NEXTAUTH_URL;
};
