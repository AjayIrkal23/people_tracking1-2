import { HttpException } from "./root";

export class InternalException extends HttpException {
  constructor(message: string, errors: any, errorCode: number) {
    super(message, errorCode, 500, errors);

    // Correct the prototype chain manually
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
