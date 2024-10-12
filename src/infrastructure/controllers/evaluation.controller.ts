import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { EvaluationGuard } from './guards';
import { EvaluateInputUseCase, IDecomposeEvaluationInput } from '@application/usecases/evaluate-input/evaluate-input.usecase';

@UseGuards(EvaluationGuard)
@Controller('evaluate')
export class CalculatorController {
  constructor(
    private readonly evaluationUseCase: EvaluateInputUseCase,
  ) {}

  @Post()
  async evaluate(@Body() dto: IDecomposeEvaluationInput): Promise<{ result: number }> {
    const result = await this.evaluationUseCase.execute(dto);

    return { result };
  }
}
