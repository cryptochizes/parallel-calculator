import { HttpException } from "@nestjs/common";

/**
 * The exception that is thrown when one of the arguments provided to a method is not valid.
 */
export class ValidationException extends HttpException {
  constructor(message: string) {
    super(`${message}`, 400);
  }
}
