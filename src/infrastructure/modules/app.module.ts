import { Module } from "@nestjs/common";

import { CalculatorController } from "@infrastructure/controllers";
import { EvaluateInputUseCase } from "@application/usecases/evaluate-input/evaluate-input.usecase";

import { InfraConfigModule } from './infra.config.module';

@Module({
  imports: [InfraConfigModule],
  providers: [EvaluateInputUseCase],
  controllers: [CalculatorController],
})
export class AppModule {}
