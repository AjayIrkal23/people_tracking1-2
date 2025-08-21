import UserModel from "@/resources/user/user.model";
import { Response, NextFunction } from "express";
import { UnauthorizedException } from "@/utils/exceptions/unauthorized.exception";
import { ErrorCode } from "@/utils/exceptions/root";
import * as jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@/utils/secrets";
import { AuthenticatedRequest } from "@/utils/interfaces/authenticated-req.interface";

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1] || "";
  if (!token) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
    const user = await UserModel.findById(payload.user._id)
      .select("-password")
      .exec();

    if (!user) {
      return next(
        new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};
