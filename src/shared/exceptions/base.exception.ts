export class BaseException extends Error {
  constructor(
    message?: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.details = details;
  }
}
