import { Test, TestingModule } from '@nestjs/testing';

import { ConfigServiceImpl } from '@infrastructure/config';
import { CalculatorController } from '@infrastructure/controllers';

import { ConfigService } from '@application/common/config';
import { EvaluateInputUseCase } from '@application/usecases/evaluate-input/evaluate-input.usecase';

const configMock = {
  APP_PORT: 8080,
  APP_NAME: 'calculator',
}

describe('EvaluationController', () => {
  let appController: CalculatorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CalculatorController],
      providers: [
        {
          provide: ConfigService,
          useFactory: () => new ConfigServiceImpl(configMock),
        },
        EvaluateInputUseCase,
      ],
    }).compile();

    appController = app.get<CalculatorController>(CalculatorController);
  });

  describe('root', () => {
    const testCases = [
      {
        input: {
          expression: '(10+20)*(3-1)/(15+5)-6',
        },
        output: {
          result: -3,
        },
      },
      {
        input: {
          expression: '5*(12+3)-(14/2)+6*(11-15)',
        },
        output: {
          result: 44,
        },
      },
      {
        input: {
          expression: '(1+(22/11)*3-4)*(5-6)+18/(3+3)',
        },
        output: {
          result: 0,
        },
      },
      {
        input: {
          expression: '(30-12)*(25/5+2)-40*(1+1)',
        },
        output: {
          result: 46,
        },
      },
    ];

    testCases.forEach((testCase, index) => {
      it(`should return ${testCase.output.result} for expression: ${testCase.input.expression}`, async () => {
        expect(await appController.evaluate(testCase.input)).toEqual(testCase.output);
      });
    });
  });
});
