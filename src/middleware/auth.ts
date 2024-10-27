import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
     res.status(401).json({ msg: "No token, authorization denied" });
     return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
         res.status(401).json({ message: "Unauthorized" });
         return
      }
    (req as AuthenticatedRequest).user = decoded as AuthenticatedRequest["user"]; // Attach decoded token to req.user
     next();
  } catch (err) {
    res.status(403).json({ msg: "Token is not valid" });
  }
};
