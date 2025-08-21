import ConnectPointModel from "./connectPoint.model";
import GatewayModel from "../gateway/gateway.model";
import { IConnectPoint } from "./connectPoint.interface";
import { BadRequestsException } from "@/utils/exceptions/bad-request.exception";
import { NotFoundException } from "@/utils/exceptions/not-found.exception";
import { ErrorCode } from "@/utils/exceptions/root";
import { ConnectPointLogsModel } from "./connectPointLogs.model";
import { Battery } from "@/utils/interfaces/common";

class ConnectPointService {
  private connectPoint = ConnectPointModel;
  private gateway = GatewayModel;
  private connectPointLog = ConnectPointLogsModel;

  public async registerConnectPoint(
    cpid: number,
    pillarStart: number,
    pillarEnd: number
  ): Promise<IConnectPoint> {
    let connectPoint = await this.connectPoint.findOne({ cpid });
    if (connectPoint) {
      throw new BadRequestsException(
        "Connect Point Already Exists",
        ErrorCode.USER_ALREADY_EXISTS
      );
    }

    connectPoint = await this.connectPoint.create({
      cpid,
      range: {
        pillarStart,
        pillarEnd,
      },
    });

    return connectPoint;
  }

  public getConnectPoints = async (location: Battery) => {
    const connectPoints = await this.connectPoint.find({}).populate({
      path: "parentGateway",
      match: { location: location }, // filtering based on location
      select: "-connectPoints",
    });

    // filter out connect points where parentGateway is null (no match)
    return connectPoints.filter((point) => point.parentGateway);
  };

  public deleteConnectPoint = async (cpid: number) => {
    const connectPointToDelete = await this.connectPoint.findOne({ cpid });

    if (!connectPointToDelete) {
      throw new NotFoundException(
        "Connect Point not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    if (connectPointToDelete.parentGateway) {
      await this.gateway.updateOne(
        { _id: connectPointToDelete.parentGateway },
        { $pull: { connectPoints: connectPointToDelete._id } }
      );
    }

    const deletedConnectPoint = await this.connectPoint.findOneAndDelete(
      { cpid },
      {
        select: "-createdAt -updatedAt -__v",
      }
    );

    return deletedConnectPoint;
  };

  public addConnectPointOnMap = async (
    cpid: number,
    normalizedX: number,
    normalizedY: number
  ) => {
    const updatedConnectPoint = await this.connectPoint.findOneAndUpdate(
      { cpid },
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

    if (!updatedConnectPoint) {
      throw new NotFoundException(
        "Connect Point not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    return updatedConnectPoint;
  };

  public addConnectPointROIOnMap = async (
    cpid: number,
    roiPoints: number[]
  ) => {
    const updatedConnectPoint = await this.connectPoint.findOneAndUpdate(
      { cpid },
      {
        $set: {
          boundingBoxOnMap: roiPoints,
        },
      },
      { new: true }
    );

    if (!updatedConnectPoint) {
      throw new NotFoundException(
        "Connect Point not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    return updatedConnectPoint;
  };

  public removeConnectPointFromMap = async (cpid: number) => {
    const connectPointToUpdate = await this.connectPoint.findOne({ cpid });

    if (!connectPointToUpdate) {
      throw new NotFoundException(
        "Connect Point not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    const updatedConnectPoint = await this.connectPoint.findOneAndUpdate(
      { cpid },
      { positionOnMap: null, boundingBoxOnMap: null }
    );

    return updatedConnectPoint;
  };

  /**
   * Saves a log entry for a connect point activity
   */
  public saveConnectPointLogs = async (
    cpid: number,
    timestamp: Date
  ): Promise<{ success: boolean }> => {
    // Convert timestamp to IST by adding 5.5 hours
    const istTimestamp = new Date(timestamp.getTime() + 5.5 * 60 * 60 * 1000);

    // Format date as YYYY-MM-DD for the document key
    const dateKey = istTimestamp.toISOString().split("T")[0];

    // Use dot notation for the push operation to handle dynamic field names
    const fieldPath = `cpids.${cpid}`;

    await this.connectPointLog.updateOne(
      { date: dateKey },
      {
        $push: {
          [fieldPath]: timestamp,
        },
      },
      { upsert: true }
    );

    return { success: true };
  };

  /**
   * Fetches connect point logs for a specific date
   */
  public fetchConnectPointLogs = async (
    dateStr: string
  ): Promise<{
    date: string;
    cpids: { [key: string]: boolean[] };
  }> => {
    // Find logs for the specific date
    const logs = await this.connectPointLog.findOne({ date: dateStr });

    // Initialize result structure
    const result = {
      date: dateStr,
      cpids: {} as { [key: string]: boolean[] },
    };

    if (!logs) {
      return result;
    }

    // Process logs into hourly activity format
    Object.entries(logs.cpids || {}).forEach(([cpidStr, timestamps]) => {
      // Create a 24-element array representing hours (0-23), all initialized to false
      const hourlyActivity = Array(24).fill(false);

      // Fix the timestamps type issue with type assertion
      const typedTimestamps = timestamps as Date[];

      // Mark hours with activity as true
      typedTimestamps.forEach((timestamp) => {
        const hour = new Date(timestamp).getHours();
        hourlyActivity[hour] = true;
      });

      result.cpids[cpidStr] = hourlyActivity;
    });

    return result;
  };
}

export default ConnectPointService;
