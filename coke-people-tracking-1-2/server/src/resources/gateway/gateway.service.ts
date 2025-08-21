import ConnectPointModel from "../connectPoint/connectPoint.model";
import GatewayModel from "./gateway.model";
import { GatewaySide, IGateway } from "./gateway.interface";
import { BadRequestsException } from "@/utils/exceptions/bad-request.exception";
import { NotFoundException } from "@/utils/exceptions/not-found.exception";
import { ErrorCode } from "@/utils/exceptions/root";
import { Types } from "mongoose";
import { Battery } from "@/utils/interfaces/common";

class GatewayService {
  private connectPoint = ConnectPointModel;
  private gateway = GatewayModel;

  public async registerGateway(
    gwid: number,
    side: GatewaySide,
    location: Battery,
    connectPoints: Types.ObjectId[]
  ): Promise<IGateway> {
    console.log(gwid);
    let gateway = await this.gateway.findOne({ gwid });

    if (gateway) {
      throw new BadRequestsException(
        "Gateway Already Exists",
        ErrorCode.USER_ALREADY_EXISTS
      );
    }

    gateway = await this.gateway.create({
      gwid,
      side,
      location,
      connectPoints,
    });

    connectPoints.map(async (_id) => {
      await this.connectPoint.findByIdAndUpdate(_id, {
        parentGateway: gateway._id,
      });
    });

    return gateway;
  }

  public getGateways = async (location: Battery) => {
    const gateway = await this.gateway.find(
      { location },
      "-createdAt -updatedAt"
    );
    return gateway;
  };

  public deleteGateway = async (gwid: number) => {
    const gatewayToDelete = await this.gateway.findOne({ gwid });

    if (!gatewayToDelete) {
      throw new NotFoundException(
        "Gateway not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    if (
      gatewayToDelete.connectPoints &&
      gatewayToDelete.connectPoints.length > 0
    ) {
      await this.connectPoint.updateMany(
        { _id: { $in: gatewayToDelete.connectPoints } },
        { $set: { parentGateway: null } }
      );
    }

    const deletedGateway = await this.gateway.findOneAndDelete(
      { gwid },
      {
        select: "-createdAt -updatedAt -__v",
      }
    );

    return deletedGateway;
  };

  public addGatewayOnMap = async (
    gwid: number,
    normalizedX: number,
    normalizedY: number
  ) => {
    const updatedGateway = await this.gateway.findOneAndUpdate(
      { gwid },
      {
        $set: {
          positionOnMap: {
            normalizedX,
            normalizedY,
          },
        },
      },
      { new: true }
    );

    if (!updatedGateway) {
      throw new NotFoundException(
        "Gateway not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    return updatedGateway;
  };

  public removeGatewayFromMap = async (gwid: number) => {
    const gatewayToUpdate = await this.gateway.findOne({ gwid });

    if (!gatewayToUpdate) {
      throw new NotFoundException(
        "Gateway not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    const updatedGateway = await this.gateway.findOneAndUpdate(
      { gwid },
      { positionOnMap: null }
    );

    return updatedGateway;
  };
}

export default GatewayService;
