import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authorize(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  console.log(header);
  if (!header) {
    res.status(401).json({ message: "No token provided" });
  }

  const [scheme, token] = header?.split(" ") || [];
  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "Invalid auth format" });
  }
  const secret = process.env.JWT_SECRET!;

  try {
    const payload = jwt.verify(token, secret);
    (req as any).user = payload;
    console.log("User authorized:", (req as any).user);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}