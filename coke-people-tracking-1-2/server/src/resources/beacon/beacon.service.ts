import BeaconModel from "./beacon.model";
import ConnectPointModel from "../connectPoint/connectPoint.model";
import GatewayModel from "../gateway/gateway.model";
import AssignmentHistoryModel from "./assignment.model";
import { BeaconLocation, BeaconStatus, IBeacon } from "./beacon.interface";
import { BadRequestsException } from "@/utils/exceptions/bad-request.exception";
import { NotFoundException } from "@/utils/exceptions/not-found.exception";
import { ErrorCode } from "@/utils/exceptions/root";
import ViolationService from "../violations/violation.service";
import ConnectPointService from "../connectPoint/connectPoint.service";
import { Battery } from "@/utils/interfaces/common";
import LogsService from "../logs/logs.service";

class BeaconService {
  private beacon = BeaconModel;
  private connectPoint = ConnectPointModel;
  private gateway = GatewayModel;
  private assignmentHistory = AssignmentHistoryModel;
  private ViolationService = new ViolationService();
  private ConnectPointService = new ConnectPointService();
  private LogsService = new LogsService();

  public async registerBeacon(bnid: number): Promise<IBeacon> {
    let beacon = await this.beacon.findOne({ bnid });
    if (beacon) {
      throw new BadRequestsException(
        "Beacon Already Exists",
        ErrorCode.USER_ALREADY_EXISTS
      );
    }

    beacon = await this.beacon.create({
      bnid,
    });

    return beacon;
  }

  public getBeacons = async (location: BeaconLocation) => {
    const beacons = await this.beacon.find(
      { location: { $in: [location, BeaconLocation.dcsRoom] } },
      "-createdAt -updatedAt"
    );
    return beacons;
  };

  public deleteBeacon = async (bnid: number) => {
    const beaconToDelete = await this.beacon.findOne({ bnid });

    if (!beaconToDelete) {
      throw new NotFoundException("Beacon not found", ErrorCode.USER_NOT_FOUND);
    }

    const deletedBeacon = await this.beacon.findOneAndDelete(
      { bnid },
      {
        select: "-createdAt -updatedAt -__v",
      }
    );

    return deletedBeacon;
  };

  public assignEmployeeToBeacon = async (
    bnid: number,
    assignedEmployee: string
  ) => {
    const beacon = await this.beacon.findOne({ bnid });

    if (!beacon) {
      throw new NotFoundException("Beacon not found", ErrorCode.USER_NOT_FOUND);
    }

    const updatedBeacon = await this.beacon.findOneAndUpdate(
      { bnid },
      {
        assignedEmployee,
        lastActive: new Date(),
        employeeLastAssigned: new Date(),
      },
      {
        select: "-createdAt -updatedAt -__v",
        new: true,
      }
    );

    await this.assignmentHistory.create({
      bnid,
      employee: assignedEmployee,
      assignedAt: new Date(),
    });

    return updatedBeacon;
  };

  public clearEmployeeFromBeacon = async (bnid: number) => {
    const beacon = await this.beacon.findOne({ bnid });

    if (!beacon) {
      throw new NotFoundException("Beacon not found", ErrorCode.USER_NOT_FOUND);
    }

    const updatedBeacon = await this.beacon.findOneAndUpdate(
      { bnid },
      { assignedEmployee: "Unassigned" },
      {
        select: "-createdAt -updatedAt -__v",
        new: true,
      }
    );

    return updatedBeacon;
  };

  private updateDCSBeacon = async (
    bnid: number,
    status: BeaconStatus,
    battery: number,
    location: BeaconLocation
  ) => {
    const updatedBeacon = await this.beacon.findOneAndUpdate(
      { bnid },
      { status, battery, location },
      { select: "-createdAt -updatedAt -__v", new: true }
    );

    if (!updatedBeacon) {
      throw new NotFoundException("Beacon not found", ErrorCode.USER_NOT_FOUND);
    }

    // logging for all events page
    await this.LogsService.logBeaconToDCS();

    return updatedBeacon;
  };

  private updateCellarBeacon = async (
    bnid: number,
    latestCpid: number,
    latestGwid: number,
    status: BeaconStatus,
    battery: number,
    location: BeaconLocation
  ) => {
    const beacon = await this.beacon.findOne({ bnid });
    const connectPoint = await this.connectPoint.findOne({ cpid: latestCpid });

    if (!beacon) {
      throw new NotFoundException(
        "Connect Point not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    if (!connectPoint) {
      throw new NotFoundException(
        "Connect Point not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    // logging for all events page
    await this.LogsService.logBeaconToConnectPoint();

    // if (beacon.status === BeaconStatus.OK) {
    if (status === BeaconStatus.SOS || status === BeaconStatus.IDLE) {
      const gateway = await this.gateway.findOne({ gwid: latestGwid });

      if (!gateway) {
        throw new NotFoundException(
          "Gateway not found",
          ErrorCode.USER_NOT_FOUND
        );
      }

      await this.ViolationService.createViolation(
        bnid,
        latestCpid,
        latestGwid,
        status,
        beacon.assignedEmployee,
        gateway.side
      );
    }

    const updatedBeacon = await this.beacon.findOneAndUpdate(
      { bnid },
      {
        latestGwid,
        latestCpid,
        latestBoundingBox: connectPoint.boundingBoxOnMap,
        status,
        battery,
        location,
        lastActive: new Date(),
      },
      { select: "-createdAt -updatedAt -__v", new: true }
    );

    return updatedBeacon;
    // } else {
    //   return { message: "First Acknowledge DCS Popup" };
    // }
  };

  private updateCPGWHealth = async (
    latestCpid: number,
    latestGwid: number,
    bnid?: number
  ) => {
    const [updatedConnectPoint, updatedGateway] = await Promise.all([
      this.connectPoint.findOneAndUpdate(
        { cpid: latestCpid },
        { lastActiveDateTime: new Date() },
        { select: "-createdAt -updatedAt -__v", new: true }
      ),
      this.gateway.findOneAndUpdate(
        { gwid: latestGwid },
        { lastActiveDateTime: new Date() },
        { select: "-createdAt -updatedAt -__v", new: true }
      ),
    ]);

    if (!updatedConnectPoint) {
      throw new NotFoundException(
        "Connect Point not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    if (!updatedGateway) {
      throw new NotFoundException(
        "Gateway not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    if (!bnid) {
      // logging connect point heartbeat - for cp logs page
      await this.ConnectPointService.saveConnectPointLogs(
        latestCpid,
        new Date()
      );

      // logging heart beat - for all events page
      await this.LogsService.logConnectPointHeartbeat();
    }

    return { updatedConnectPoint, updatedGateway };
  };

  private updateGWHealth = async (latestGwid: number) => {
    const [updatedGateway] = await Promise.all([
      this.gateway.findOneAndUpdate(
        { gwid: latestGwid },
        { lastActiveDateTime: new Date() },
        { select: "-createdAt -updatedAt -__v", new: true }
      ),
    ]);

    if (!updatedGateway) {
      throw new NotFoundException(
        "Gateway not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    // logging heart beat - for all events page
    await this.LogsService.logGatewayHeartbeat();

    return { updatedGateway };
  };

  public updateBeaconHandler = async (updateObject: {
    bnid: number;
    latestGwid: number;
    latestCpid: number;
    status: BeaconStatus;
    battery: number;
    location: BeaconLocation | null;
  }) => {
    let { bnid, latestGwid, latestCpid, status, battery, location } =
      updateObject;

    if (location === null) {
      // fetching the location of latestGwid and assigning to the beacon's location
      const gateway = await this.gateway.findOne({ gwid: latestGwid });
      if (!gateway) {
        throw new NotFoundException(
          "Gateway Not Found",
          ErrorCode.USER_NOT_FOUND
        );
      }
      location = gateway.location as unknown as BeaconLocation;
    }

    if (bnid > 0 && location === BeaconLocation.dcsRoom) {
      // when beacon is in dcs room
      const updatedBeacon = await this.updateDCSBeacon(
        bnid,
        status,
        battery,
        location
      );
      return updatedBeacon;
    } else if (
      bnid > 0 &&
      (location === BeaconLocation.battery1 ||
        location === BeaconLocation.battery2)
    ) {
      // when beacon is in cellar area
      const updatedBeacon = await this.updateCellarBeacon(
        bnid,
        latestCpid,
        latestGwid,
        status,
        battery,
        location
      );
      await this.updateCPGWHealth(latestCpid, latestGwid, bnid);
      return updatedBeacon;
    } else if (bnid === 0 && latestCpid > 0 && latestGwid > 0) {
      // updating the connect point & gateway health
      const { updatedConnectPoint, updatedGateway } =
        await this.updateCPGWHealth(latestCpid, latestGwid);
      return { updatedConnectPoint, updatedGateway };
    } else if (bnid === 0 && latestCpid === 0 && latestGwid > 0) {
      // updating the gateway health
      const { updatedGateway } = await this.updateGWHealth(latestGwid);
      return { updatedGateway };
    } else {
      // when no conditions met
      throw new BadRequestsException(
        "Bad Request",
        ErrorCode.UNPROCESSABLE_ENTITY
      );
    }
  };

  public resetBeacon = async (bnid: number) => {
    const beacon = await this.beacon.findOne({ bnid });

    if (!beacon) {
      throw new NotFoundException("Beacon not found", ErrorCode.USER_NOT_FOUND);
    }

    let updatedBeacon;

    if (
      beacon.status !== BeaconStatus.OK &&
      beacon.location !== BeaconLocation.dcsRoom
    ) {
      updatedBeacon = await this.beacon.findOneAndUpdate(
        { bnid },
        {
          status: BeaconStatus.OK,
        },
        {
          select: "-createdAt -updatedAt -__v",
          new: true,
        }
      );
    } else {
      updatedBeacon = await this.beacon.findOneAndUpdate(
        { bnid },
        {
          status: BeaconStatus.OK,
          location: BeaconLocation.battery1,
          latestCpid: null,
          latestBoundingBox: null,
          latestGwid: null,
        },
        {
          select: "-createdAt -updatedAt -__v",
          new: true,
        }
      );
    }

    return updatedBeacon;
  };

  public getAssignmentHistory = async () => {
    const beacons = await this.assignmentHistory
      .find({}, "-createdAt -updatedAt")
      .sort({ assignedAt: -1 });
    return beacons;
  };
}

export default BeaconService;
