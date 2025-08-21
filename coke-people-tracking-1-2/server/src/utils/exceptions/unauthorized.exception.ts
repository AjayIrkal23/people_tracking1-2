import { HttpException } from "./root";

export class UnauthorizedException extends HttpException {
  constructor(message: string, errorCode: number, errors?: any) {
    super(message, errorCode, 401, errors);

    // Correct the prototype chain manually
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
