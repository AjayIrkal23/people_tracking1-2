import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, "beacon-updates.log");

// Validate beacon update parameters
const isValidBeaconUpdate = (query: any): boolean => {
  // GWID and CPID must be numeric values
  if (!query.GWID || !query.CPID || isNaN(query.GWID) || isNaN(query.CPID)) {
    return false;
  }

  // Additional check to ensure CPID is not 0
  if (Number(query.CPID) === 0) {
    return false;
  }

  // BNID must be 0
  if (query.BNID !== "0") {
    return false;
  }

  // SOS and IDLE must be 'L'
  if (query.SOS !== "L" || query.IDLE !== "L") {
    return false;
  }

  // BATTERY must be 0
  if (query.BATTERY !== "0") {
    return false;
  }

  return true;
};

export const beaconLoggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const originalSend = _res.send;

  // Check if this is a beacon update request
  if (req.method === "POST" && req.path === "/api/v1/beacon/update") {
    // Only log if parameters match the exact format
    if (isValidBeaconUpdate(req.query)) {
      const timestamp = new Date().toISOString();
      const { GWID, CPID, BNID, SOS, IDLE, BATTERY } = req.query;

      // Create log entry with timestamp
      const logEntry = `[${timestamp}] GWID=${GWID} CPID=${CPID} BNID=${BNID} SOS=${SOS} IDLE=${IDLE} BATTERY=${BATTERY}\n`;

      // Append to log file
      fs.appendFile(logFile, logEntry, (err) => {
        if (err) {
          console.error("Error writing to beacon log:", err);
        }
      });
    }
  }

  next();
};
