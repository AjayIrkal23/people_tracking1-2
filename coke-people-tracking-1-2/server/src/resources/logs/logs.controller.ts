import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import { validateSchema } from "@/middleware/validation.middleware";
import { errorHandler } from "@/utils/error-handler";
import LogsService from "./logs.service";
import { GetLogsSchema } from "./logs.validation";
import { EventType } from "./logs.model";

class LogsController implements Controller {
  public path = "/logs";
  public router = Router();
  private LogsService = new LogsService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/fetch`,
      validateSchema({ query: GetLogsSchema }),
      errorHandler(this.fetchLogs)
    );
  }

  private fetchLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { startDate, endDate, eventType } = req.query as unknown as {
      startDate: Date;
      endDate: Date;
      eventType: EventType;
    };

    const logs = await this.LogsService.fetchLogs(
      startDate,
      endDate,
      eventType
    );

    return res.status(200).json({
      data: logs,
      message: "Logs fetched successfully",
    });
  };
}

export default LogsController;
