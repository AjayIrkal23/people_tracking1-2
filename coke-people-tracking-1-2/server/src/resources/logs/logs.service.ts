import { EventType, LogsModel } from "./logs.model";
import GatewayModel from "../gateway/gateway.model";
import connectPointModel from "../connectPoint/connectPoint.model";
import { BadRequestsException } from "@/utils/exceptions/bad-request.exception";
import { NotFoundException } from "@/utils/exceptions/not-found.exception";
import { ErrorCode } from "@/utils/exceptions/root";

class LogsService {
  private logs = LogsModel;
  private connectPoint = connectPointModel;

  public async logConnectPointHeartbeat() {
    const logEntry = await this.logs.create({
      eventType: EventType.CONNECT_POINT_HEARTBEAT,
    });

    return logEntry;
  }

  public async logGatewayHeartbeat() {
    const logEntry = await this.logs.create({
      eventType: EventType.GATEWAY_HEARTBEAT,
    });

    return logEntry;
  }

  public async logBeaconToDCS() {
    const logEntry = await this.logs.create({
      eventType: EventType.BEACON_TO_DCS_DEVICE,
    });

    return logEntry;
  }

  public async logBeaconToConnectPoint() {
    const logEntry = await this.logs.create({
      eventType: EventType.BEACON_TO_CONNECT_POINT,
    });

    return logEntry;
  }

  public async fetchLogs(startDate?: Date, endDate?: Date, type?: EventType) {
    const query: any = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      query.createdAt = {
        $gte: start.setHours(0, 0, 0, 0),
        $lte: end.setHours(23, 59, 59, 999),
      };
    }

    if (type) {
      query.eventType = type;
    }

    const logs = await this.logs.find(query).sort({ createdAt: -1 }).lean();

    return logs;
  }
}

export default LogsService;
