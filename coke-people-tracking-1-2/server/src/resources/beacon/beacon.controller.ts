import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import { validateSchema } from "@/middleware/validation.middleware";
import {
  RegisterBeaconSchema,
  DeleteBeaconSchema,
  AssignEmployeeSchema,
  ClearEmployeeSchema,
  UpdateBeaconSchema,
  GetBeaconsSchema,
  GetBeaconPathSchema,
} from "./beacon.validation";
import { errorHandler } from "@/utils/error-handler";
import BeaconService from "./beacon.service";
import { BeaconLocation, BeaconStatus } from "./beacon.interface";
import { Battery } from "@/utils/interfaces/common";

class BeaconController implements Controller {
  public path = "/beacon";
  public router = Router();
  private BeaconService = new BeaconService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validateSchema({ body: RegisterBeaconSchema }),
      errorHandler(this.registerBeacon)
    );
    this.router.get(
      `${this.path}/`,
      validateSchema({ query: GetBeaconsSchema }),
      errorHandler(this.getBeacons)
    );
    this.router.get(
      `${this.path}/path`,
      validateSchema({ query: GetBeaconPathSchema }),
      errorHandler(this.getBeaconPath)
    );
    this.router.delete(
      `${this.path}/delete/:bnid`,
      validateSchema({ params: DeleteBeaconSchema }),
      errorHandler(this.deleteBeacon)
    );
    this.router.patch(
      `${this.path}/assignEmployee`,
      validateSchema({ body: AssignEmployeeSchema }),
      errorHandler(this.assignEmployeeToBeacon)
    );
    this.router.patch(
      `${this.path}/employee/clear/:bnid`,
      validateSchema({ params: ClearEmployeeSchema }),
      errorHandler(this.clearEmployeeFromBeacon)
    );
    this.router.post(
      `${this.path}/update`,
      // validateSchema({ query: UpdateBeaconSchema }),
      errorHandler(this.updateBeacon)
    );
    this.router.post(`${this.path}/reset`, errorHandler(this.resetBeacon));
    this.router.get(
      `${this.path}/assignmentHistory`,
      errorHandler(this.getAssignmentHistory)
    );
  }

  private registerBeacon = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { bnid } = req.body;
    const beacon = await this.BeaconService.registerBeacon(bnid);
    res.json({ beacon });
  };

  private getBeacons = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { location } = req.query;
    const beacons = await this.BeaconService.getBeacons(
      location as BeaconLocation
    );
    res.json(beacons);
  };

  private deleteBeacon = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const bnid = Number(req.params.bnid);
    const beacon = await this.BeaconService.deleteBeacon(bnid);
    res.json(beacon);
  };

  private assignEmployeeToBeacon = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { bnid, employeeName } = req.body;
    if (bnid && employeeName) {
      const beacon = await this.BeaconService.assignEmployeeToBeacon(
        bnid,
        employeeName
      );
      res.json(beacon);
    }
  };

  private clearEmployeeFromBeacon = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { bnid } = req.params;
    const beacon = await this.BeaconService.clearEmployeeFromBeacon(
      Number(bnid)
    );
    res.json(beacon);
  };

  private updateBeacon = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { GWID, CPID, BNID, SOS, IDLE, BATTERY, LOCATION } = req.query;
    const updateObject = {
      bnid: Number(BNID),
      latestGwid: Number(GWID),
      latestCpid: Number(CPID),
      status:
        SOS === "H"
          ? BeaconStatus.SOS
          : IDLE === "H"
          ? BeaconStatus.IDLE
          : BeaconStatus.OK,
      battery: Number(BATTERY),
      location: LOCATION ? BeaconLocation.dcsRoom : null,
    };
    const beacon = await this.BeaconService.updateBeaconHandler(updateObject);
    res.json(beacon);
  };

  private resetBeacon = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { bnid } = req.body;
    const beacon = await this.BeaconService.resetBeacon(bnid);
    res.json(beacon);
  };

  private getAssignmentHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const history = await this.BeaconService.getAssignmentHistory();
    res.json(history);
  };

  private getBeaconPath = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { bnid, date, battery } = req.query;
    const location = (battery as Battery) as unknown as BeaconLocation;
    const path = await this.BeaconService.getBeaconPath(
      Number(bnid),
      date as string,
      location
    );
    res.json(path);
  };
}

export default BeaconController;
