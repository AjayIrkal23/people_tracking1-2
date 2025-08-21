import ViolationModel from "./violation.model";
import { Shift, Violation, ViolationType } from "./violation.interface";
import { BeaconStatus, IBeacon } from "../beacon/beacon.interface";
import { GatewaySide } from "../gateway/gateway.interface";
// import { PopulatedDevice } from "../device/device.interface";
// import ExcelJS from "exceljs";
// import { headingStyle } from "@/utils/helpers/excel";

class ViolationService {
  private violation = ViolationModel;

  public async createViolation(
    bnid: number,
    cpid: number,
    gwid: number,
    status: BeaconStatus,
    employeeName: string,
    location: GatewaySide
  ) {
    return this.violation.create({
      bnid,
      cpid,
      gwid,
      violationType: status,
      employeeName: employeeName || "Unknown",
      location,
    });
  }

  public async getViolations(
    startDate?: string,
    endDate?: string,
    shift?: Shift
  ) {
    const query: any = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (shift) {
        const dates = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
          const dayStart = new Date(currentDate);
          const dayEnd = new Date(currentDate);

          switch (shift) {
            case "A":
              dayStart.setHours(6, 0, 0, 0);
              dayEnd.setHours(13, 59, 59, 999);
              break;
            case "B":
              dayStart.setHours(14, 0, 0, 0);
              dayEnd.setHours(21, 59, 59, 999);
              break;
            case "C":
              dayStart.setHours(22, 0, 0, 0);
              dayEnd.setDate(dayEnd.getDate() + 1);
              dayEnd.setHours(5, 59, 59, 999);
              break;
            case "F":
              dayStart.setHours(0, 0, 0, 0);
              dayEnd.setHours(23, 59, 59, 999);
              break;
          }

          dates.push({
            $and: [
              { createdAt: { $gte: dayStart } },
              { createdAt: { $lte: dayEnd } },
            ],
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }

        query.$or = dates;
      } else {
        query.createdAt = {
          $gte: start.setHours(0, 0, 0, 0),
          $lte: end.setHours(23, 59, 59, 999),
        };
      }
    }

    return await this.violation
      .find(query, {
        updatedAt: 0,
        __v: 0,
      })
      .sort({ createdAt: -1 });
  }

  //   public async getReport(
  //     type: ViolationType,
  //     startDate?: string,
  //     endDate?: string
  //   ) {
  //     const query: any = { violationType: type };

  //     if (startDate && endDate) {
  //       query.createdAt = {
  //         $gte: new Date(startDate),
  //         $lte: new Date(endDate).setHours(23, 59, 59, 999),
  //       };
  //     }

  //     const violations: Violation[] = await this.violation
  //       .find(query, {
  //         violationType: 0,
  //         updatedAt: 0,
  //         __v: 0,
  //       })
  //       .sort({ createdAt: -1 });

  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet("Sheet 1");

  //     worksheet.columns = [
  //       { header: "DEVICE ID", key: "deviceId", width: 10 },
  //       { header: "EMPLOYEE NAME", key: "employeeName", width: 15 },
  //       { header: "EMPLOYEE DESIGNATION", key: "employeeDesignation", width: 20 },
  //       { header: "EMPLOYEE PHONE", key: "employeePhone", width: 20 },
  //       { header: "EMPLOYEE EMAIL", key: "employeeEmail", width: 20 },
  //       { header: "TIMESTAMP", key: "timestamp", width: 20 },
  //     ];

  //     worksheet.getRow(1).eachCell((cell) => {
  //       cell.style = headingStyle as Partial<ExcelJS.Style>;
  //     });

  //     violations.forEach((obj, index) => {
  //       worksheet.addRow({
  //         sno: index + 1,
  //         deviceId: obj.deviceId,
  //         employeeName: obj.employeeName,
  //         employeeDesignation: obj.employeeDesignation,
  //         employeePhone: obj.employeePhone,
  //         employeeEmail: obj.employeeEmail,
  //         timestamp: obj.createdAt
  //           ? new Date(obj.createdAt).toLocaleString("en-IN")
  //           : "--",
  //       });
  //     });

  //     const buffer = await workbook.xlsx.writeBuffer();
  //     return buffer;
  //   }
}

export default ViolationService;
