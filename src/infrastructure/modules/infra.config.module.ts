import { Global, Module, Provider } from '@nestjs/common';

import { ConfigService } from '@application/common/config';

import { ConfigServiceImpl } from '@infrastructure/config';

const providers: Provider[] = [
  {
    provide: ConfigService,
    useFactory: () => new ConfigServiceImpl(),
  },
];

@Global()
@Module({
  providers: providers,
  exports: providers,
})
export class InfraConfigModule {}
