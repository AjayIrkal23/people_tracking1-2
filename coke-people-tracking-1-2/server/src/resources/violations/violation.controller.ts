import { Router, Request, Response, NextFunction } from "express";
import Controller from "@/utils/interfaces/controller.interface";
import ViolationService from "./violation.service";
import { errorHandler } from "@/utils/error-handler";
import { Shift, ViolationType } from "./violation.interface";
// import { generateFilename } from "@/utils/helpers/generateFilename";
import { validateSchema } from "@/middleware/validation.middleware";
import { GetViolationSchema } from "./violation.validation";
// import { GetReportSchema, GetViolationSchema } from "./violation.validation";

class ViolationController implements Controller {
  public path = "/violation";
  public router = Router();
  private ViolationService = new ViolationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/all`,
      validateSchema({ query: GetViolationSchema }),
      errorHandler(this.getViolations)
    );
    // this.router.get(
    //   `${this.path}/report`,
    //   validateSchema({ query: GetReportSchema }),
    //   errorHandler(this.getReport)
    // );
  }

  private getViolations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { startDate, endDate, shift } = req.query;

    const violations = await this.ViolationService.getViolations(
      startDate as string | undefined,
      endDate as string | undefined,
      shift as Shift
    );
    res.json(violations);
  };

  //   private getReport = async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<Response | void> => {
  //     const { type, startDate, endDate } = req.query;

  //     const excelBuffer = await this.ViolationService.getReport(
  //       type as ViolationType,
  //       startDate as string | undefined,
  //       endDate as string | undefined
  //     );

  //     const filename =
  //       startDate && endDate
  //         ? generateFilename(
  //             type as ViolationType,
  //             startDate as string,
  //             endDate as string
  //           )
  //         : `${type}_Violation_Report.xlsx`;

  //     res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  //     res.setHeader(
  //       "Content-Type",
  //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //     );

  //     return res.send(excelBuffer);
  //   };
}

export default ViolationController;
