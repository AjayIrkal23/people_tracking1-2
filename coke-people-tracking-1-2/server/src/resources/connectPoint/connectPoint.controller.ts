import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import { validateSchema } from "@/middleware/validation.middleware";
import {
  RegisterConnectPointSchema,
  DeleteConnectPointSchema,
  AddConnectPointOnMapSchema,
  RemoveConnectPointFromMapSchema,
  AddConnectPointROIOnMapSchema,
  GetConnectPointLogSchema,
  GetConnectPointsSchema,
} from "./connectPoint.validation";
import { errorHandler } from "@/utils/error-handler";
import ConnectPointService from "./connectPoint.service";
import { Battery } from "@/utils/interfaces/common";

class ConnectPointController implements Controller {
  public path = "/connectPoint";
  public router = Router();
  private ConnectPointService = new ConnectPointService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validateSchema({ body: RegisterConnectPointSchema }),
      errorHandler(this.registerConnectPoint)
    );
    this.router.get(
      `${this.path}/`,
      validateSchema({ query: GetConnectPointsSchema }),
      errorHandler(this.getConnectPoints)
    );
    this.router.delete(
      `${this.path}/delete/:cpid`,
      validateSchema({ params: DeleteConnectPointSchema }),
      errorHandler(this.deleteConnectPoint)
    );
    this.router.post(
      `${this.path}/addOnMap`,
      validateSchema({ body: AddConnectPointOnMapSchema }),
      errorHandler(this.addConnectPointOnMap)
    );
    this.router.post(
      `${this.path}/roi/addOnMap`,
      validateSchema({ body: AddConnectPointROIOnMapSchema }),
      errorHandler(this.addConnectPointROIOnMap)
    );
    this.router.patch(
      `${this.path}/removeFromMap/:cpid`,
      validateSchema({ params: RemoveConnectPointFromMapSchema }),
      errorHandler(this.removeConnectPointFromMap)
    );
    this.router.get(
      `${this.path}/logs`,
      // validateSchema({ query: GetConnectPointLogSchema }),
      errorHandler(this.fetchConnectPointLogs)
    );
  }

  private registerConnectPoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { cpid, pillarStart, pillarEnd } = req.body;
    const connectPoint = await this.ConnectPointService.registerConnectPoint(
      cpid,
      pillarStart,
      pillarEnd
    );
    res.json({ connectPoint });
  };

  private getConnectPoints = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { location } = req.query;
    const connectPoints = await this.ConnectPointService.getConnectPoints(
      location as Battery
    );
    res.json(connectPoints);
  };

  private deleteConnectPoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const cpid = Number(req.params.cpid);
    const connectPoint = await this.ConnectPointService.deleteConnectPoint(
      cpid
    );
    res.json(connectPoint);
  };

  private addConnectPointOnMap = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { cpid, normalizedX, normalizedY } = req.body;
    const connectPoint = await this.ConnectPointService.addConnectPointOnMap(
      cpid,
      normalizedX,
      normalizedY
    );
    res.json(connectPoint);
  };

  private addConnectPointROIOnMap = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { cpid, roiPoints } = req.body;
    const connectPoint = await this.ConnectPointService.addConnectPointROIOnMap(
      cpid,
      roiPoints
    );
    res.json(connectPoint);
  };

  private removeConnectPointFromMap = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const cpid = Number(req.params.cpid);
    const connectPoint =
      await this.ConnectPointService.removeConnectPointFromMap(cpid);
    res.json(connectPoint);
  };

  private fetchConnectPointLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { date } = req.query;
    const logs = await this.ConnectPointService.fetchConnectPointLogs(
      date as string
    );
    res.json(logs);
  };
}

export default ConnectPointController;
