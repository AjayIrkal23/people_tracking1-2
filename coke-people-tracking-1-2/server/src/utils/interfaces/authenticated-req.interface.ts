import { Request } from "express";
import User from "@/resources/user/user.interface";

export interface AuthenticatedRequest extends Request {
  user?: User;
}
