import UserModel from "@/resources/user/user.model";
import IUser from "@/resources/user/user.interface";
import { NotFoundException } from "@/utils/exceptions/not-found.exception";
import { BadRequestsException } from "@/utils/exceptions/bad-request.exception";
import { ErrorCode } from "@/utils/exceptions/root";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/utils/secrets";
import { UnauthorizedException } from "@/utils/exceptions/unauthorized.exception";
import mongoose from "mongoose";

class UserService {
  private user = UserModel;

  /**
   * Register a new user
   */
  public async registerUser(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<Partial<IUser>> {
    let user = await this.user.findOne({ email });
    if (user) {
      throw new BadRequestsException(
        "User Already Exists",
        ErrorCode.USER_ALREADY_EXISTS
      );
    }

    user = await this.user.create({
      name,
      email,
      password,
      role,
    });

    // Create a new object excluding the password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return userWithoutPassword;
  }

  /**
   * Attempt to login a user
   */
  public async loginUser(
    email: string,
    password: string
  ): Promise<{
    _id: mongoose.ObjectId;
    name: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }> {
    let user = await this.user.findOne({ email });
    if (!user) {
      throw new NotFoundException("User Not Found", ErrorCode.USER_NOT_FOUND);
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestsException(
        "Incorrect Password",
        ErrorCode.INCORRECT_PASSWORD
      );
    }
    const accessToken = jwt.sign(
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return {
      _id: user._id as mongoose.ObjectId,
      name: user.name,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Get New Access Token
   */
  public async refresh(refreshToken: string): Promise<{
    _id: mongoose.ObjectId;
    name: string;
    role: string;
    email: string;
    accessToken: string;
  }> {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          reject(
            new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
          );
          return;
        }

        const jwtPayload = decoded as JwtPayload;

        if (!jwtPayload.user || typeof jwtPayload.user !== "object") {
          reject(
            new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
          );
          return;
        }

        const { _id } = jwtPayload.user;

        try {
          const newUser = await UserModel.findById(_id);

          if (!newUser) {
            reject(
              new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
            );
            return;
          }

          const accessToken = jwt.sign(
            {
              user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
              },
            },
            ACCESS_TOKEN_SECRET,
            {
              expiresIn: "1d",
            }
          );

          resolve({
            _id: newUser._id as mongoose.ObjectId,
            name: newUser.name,
            role: newUser.role,
            email: newUser.email,
            accessToken,
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * Get All Registered Users
   */
  public allUsers = async () => {
    const allUsers = await this.user.find({}, "-password");
    return allUsers;
  };
}

export default UserService;
