import { Logger, ValidationError, ValidationPipe } from "@nestjs/common";

export const EventPayloadValidator = (eventName: string) =>
  new ValidationPipe({
    transform: true,
    validationError: {
      target: false,
      value: false,
    },
    whitelist: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const errorMessages = errors.map((e) =>
        JSON.stringify(e?.constraints || e),
      );

      Logger.error(`${eventName} received invalid payload: ${errorMessages}`);
    },
  });
