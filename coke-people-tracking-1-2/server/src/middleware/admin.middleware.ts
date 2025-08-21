import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/utils/interfaces/authenticated-req.interface";
import { UnauthorizedException } from "@/utils/exceptions/unauthorized.exception";
import { ErrorCode } from "@/utils/exceptions/root";

export const adminMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user?.role === "ADMIN") {
    next();
  } else {
    return next(
      new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
    );
  }
};
