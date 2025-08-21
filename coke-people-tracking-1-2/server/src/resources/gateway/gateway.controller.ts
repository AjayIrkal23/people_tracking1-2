import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import { validateSchema } from "@/middleware/validation.middleware";
import {
  RegisterGatewaySchema,
  DeleteGatewaySchema,
  AddGatewayOnMapSchema,
  RemoveGatewayFromMapSchema,
  GetGatewaysSchema,
} from "./gateway.validation";
import { errorHandler } from "@/utils/error-handler";
import GatewayService from "./gateway.service";
import { Battery } from "@/utils/interfaces/common";

class GatewayController implements Controller {
  public path = "/gateway";
  public router = Router();
  private GatewayService = new GatewayService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validateSchema({ body: RegisterGatewaySchema }),
      errorHandler(this.registerGateway)
    );
    this.router.get(
      `${this.path}/`,
      validateSchema({ query: GetGatewaysSchema }),
      errorHandler(this.getGateways)
    );
    this.router.delete(
      `${this.path}/delete/:gwid`,
      validateSchema({ params: DeleteGatewaySchema }),
      errorHandler(this.deleteGateway)
    );
    this.router.post(
      `${this.path}/addOnMap`,
      validateSchema({ body: AddGatewayOnMapSchema }),
      errorHandler(this.addGatewayOnMap)
    );
    this.router.patch(
      `${this.path}/removeFromMap/:gwid`,
      validateSchema({ params: RemoveGatewayFromMapSchema }),
      errorHandler(this.removeGatewayFromMap)
    );
  }

  private registerGateway = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { gwid, side, location, connectPoints } = req.body;
    const gateway = await this.GatewayService.registerGateway(
      gwid,
      side,
      location,
      connectPoints
    );
    res.json({ gateway });
  };

  private getGateways = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { location } = req.query;
    const gateways = await this.GatewayService.getGateways(location as Battery);
    res.json(gateways);
  };

  private deleteGateway = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const gwid = Number(req.params.gwid);
    const gateway = await this.GatewayService.deleteGateway(gwid);
    res.json(gateway);
  };

  private addGatewayOnMap = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { gwid, normalizedX, normalizedY } = req.body;
    const gateway = await this.GatewayService.addGatewayOnMap(
      gwid,
      normalizedX,
      normalizedY
    );
    res.json(gateway);
  };

  private removeGatewayFromMap = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const gwid = Number(req.params.gwid);
    const gateway = await this.GatewayService.removeGatewayFromMap(gwid);
    res.json(gateway);
  };
}

export default GatewayController;
