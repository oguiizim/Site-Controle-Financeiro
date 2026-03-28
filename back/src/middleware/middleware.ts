import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export function AuthToken(req: AuthRequest, res: Response, next: NextFunction) {
  if (!jwtSecret) {
    throw new Error("JWT_SECRET nao foi definido no arquivo .env");
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new Error("Auth Header are undefined!");
  }
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}
