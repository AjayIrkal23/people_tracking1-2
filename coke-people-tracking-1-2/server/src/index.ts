import "module-alias/register";
import App from "./app";
import { PORT } from "@/utils/secrets";
import UserController from "./resources/user/user.controller";
import BeaconController from "./resources/beacon/beacon.controller";
import ConnectPointController from "./resources/connectPoint/connectPoint.controller";
import GatewayController from "./resources/gateway/gateway.controller";
import ViolationController from "./resources/violations/violation.controller";
import LogsController from "./resources/logs/logs.controller";

const app = new App(
  [
    new UserController(),
    new BeaconController(),
    new ConnectPointController(),
    new GatewayController(),
    new ViolationController(),
    new LogsController(),
  ],
  Number(PORT)
);

app.listen();
