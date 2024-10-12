/**
 * The exception that is thrown when a method call is invalid for the object's current state.
 */
export class InvalidOperationException extends Error {
  readonly key?: string;
  readonly details?: Record<string, string | number | boolean>;

  constructor(
    message: string,
    key?: string,
    details?: Record<string, string | number | boolean>,
  ) {
    super(message);

    this.key = key;
    this.details = details;
  }
}
