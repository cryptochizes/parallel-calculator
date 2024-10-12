import { NestFactory } from "@nestjs/core";
import {
  BadRequestException,
  Injectable,
  Logger,
  ValidationError,
  ValidationPipe,
} from "@nestjs/common";

import { ConfigService } from "@application/common/config";

import { AppModule } from "@infrastructure/modules/app.module";
import { AppClusterService } from "@infrastructure/cluster.service";

const appName = process.env.APP_NAME;
const logger = new Logger("bootstrap");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        console.error(errors);
        return new BadRequestException(errors);
      },
    }),
  );

  await app.startAllMicroservices();

  await app.listen(configService.getOrThrow("APP_PORT"), "0.0.0.0");
}

// a little beneficial with high load of requests
AppClusterService.clusterize(bootstrap);

// void bootstrap().catch((error) => {
//   console.error(error);

//   logger.error(`Failed to bootstrap ${appName}: ${error}`);
// });

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught exception caught: ${error?.message}`);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(
    `Unhandled Rejection at: ${JSON.stringify(
      promise,
    )}, reason: ${JSON.stringify(reason)}`,
  );
});
