import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ConfigService, ConfigSchema } from '@application/common/config';

import { InvalidConfigurationException } from '@shared/exceptions';
import { Optional } from '@shared/types/definitions';

import { ConfigSchemaImpl } from './config.schema';

@Injectable()
export class ConfigServiceImpl implements ConfigService {
  private readonly configStorage: ConfigSchemaImpl;

  constructor(config?: ConfigSchema) {
    this.configStorage = this.validateAndApplyConfig(config);
  }

  get<K extends keyof ConfigSchemaImpl>(
    key: K,
    defaultValue: Optional<ConfigSchemaImpl[K]>,
  ): Optional<ConfigSchemaImpl[K]> {
    return this.configStorage[key] ?? defaultValue;
  }

  getOrThrow<K extends keyof ConfigSchemaImpl>(
    key: K,
    defaultValue?: ConfigSchemaImpl[K],
  ): ConfigSchemaImpl[K] {
    const value = this.get(key, defaultValue);

    if (!value) {
      throw new InvalidConfigurationException(`value for ${key} doesn't exist`);
    }

    return value;
  }

  private validateAndApplyConfig(config?: ConfigSchema): ConfigSchemaImpl {
    const envConfig = config ? config : { ...process.env };

    const validatedConfig = plainToClass(ConfigSchemaImpl, envConfig, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
      whitelist: true,
    });

    if (errors.length > 0) {
      throw new InvalidConfigurationException(errors.toString());
    }

    return validatedConfig;
  }
}
