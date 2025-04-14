import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.ACCESS_TOKEN_SECRET_CODE;

export function setUser(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    secret
  );
}

export function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}
