/**
 * The exception that is thrown when user attempts to access a resource that he does not own
 */
export class NotFoundException extends Error {
  readonly key?: string;
  constructor(message: string, key?: string) {
    super(message);

    this.key = key;
  }
}
