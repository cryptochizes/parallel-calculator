import { Optional } from '@shared/types/definitions';

import { ConfigSchema } from './config.schema';

export abstract class ConfigService {
  abstract get<K extends keyof ConfigSchema>(
    key: K,
    defaultValue?: Optional<ConfigSchema[K]>,
  ): Optional<ConfigSchema[K]>;

  abstract getOrThrow<K extends keyof ConfigSchema>(
    key: K,
    defaultValue?: ConfigSchema[K],
  ): ConfigSchema[K];
}
