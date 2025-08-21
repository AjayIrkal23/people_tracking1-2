import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import { ErrorCode } from "@/utils/exceptions/root";
import { validateSchema } from "@/middleware/validation.middleware";
import { LoginSchema, RegisterUserSchema } from "./user.validation";
import { AuthenticatedRequest } from "@/utils/interfaces/authenticated-req.interface";
import { authMiddleware } from "@/middleware/auth.middleware";
import { errorHandler } from "@/utils/error-handler";
import UserService from "./user.service";
import { UnauthorizedException } from "@/utils/exceptions/unauthorized.exception";
import { adminMiddleware } from "@/middleware/admin.middleware";

class UserController implements Controller {
  public path = "/user";
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validateSchema({ body: RegisterUserSchema }),
      errorHandler(this.registerUser)
    );

    this.router.post(
      `${this.path}/login`,
      validateSchema({ body: LoginSchema }),
      errorHandler(this.loginUser)
    );

    this.router.get(`${this.path}/refresh`, errorHandler(this.refresh));

    this.router.post(`${this.path}/logout`, errorHandler(this.logoutUser));

    this.router.get(
      `${this.path}/me`,
      [authMiddleware],
      errorHandler(this.currentUser)
    );

    this.router.get(
      `${this.path}/all`,
      [authMiddleware, adminMiddleware],
      errorHandler(this.allUsers)
    );
  }

  private registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email, password, name, role } = req.body;

    const user = await this.UserService.registerUser(
      name,
      email,
      password,
      role
    );

    res.json({ user });
  };

  private loginUser = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    const { email, password } = req.body;

    const { _id, name, role, accessToken, refreshToken } =
      await this.UserService.loginUser(email, password);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ _id, name, role, accessToken });
  };

  private refresh = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    const refreshToken = cookies.jwt;
    const { accessToken, role, _id, name, email } =
      await this.UserService.refresh(refreshToken);
    res.json({ _id, name, role, email, accessToken });
  };

  private logoutUser = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
    }
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.json({ message: "Cookie cleared" });
  };

  private currentUser = async (req: AuthenticatedRequest, res: Response) => {
    res.json(req.user);
  };

  private allUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const allUsers = await this.UserService.allUsers();
    res.json(allUsers);
  };
}

export default UserController;
