import { Injectable, Logger } from '@nestjs/common';

import { UseCase } from '@application/common/types';

import { supportedEvalOperators } from '@shared/utils/config';
import { ValidationException } from '@shared/exceptions';
import { Worker } from 'worker_threads';
import { Decimal } from '@shared/types/decimals';
import { pool } from 'workerpool'

export interface IDecomposeEvaluationInput {
  expression: string;
};

@Injectable()
export class EvaluateInputUseCase extends UseCase<
  IDecomposeEvaluationInput,
  number
> {
  private logger: Logger;
  private pool: any;

  constructor() {
    super();

    this.logger = new Logger(EvaluateInputUseCase.name);
  }

  onModuleInit() {
    this.pool = pool('./dist/infrastructure/workers/evaluate.service.js', {
      minWorkers: 'max',
      maxWorkers: 7,
    });

    // new Worker('./src/infrastructure/workers/evaluate.service.ts', {
    //   // workerData: dto,
    //   execArgv: ["--require", "ts-node/register"]
    // });
  }

  async execute(dto: IDecomposeEvaluationInput): Promise<number> {
    // this.logger.log(`Processing created Ethereum transaction: ${dto.expression}`);

    // const postfixNotation = this.convertToPostfixNotation(dto.expression);

    // // console.log(`Reverse Polish Notation: ${postfixNotation}`);

    // const result = this.evaluatePostfixNotation(postfixNotation);

    // // console.log(`Result: ${result} for expression: ${dto.expression}`);

    // return result;

    return await this.pool
      .exec('evaluateExpression', [dto])
  }

  // RPN
  private convertToPostfixNotation(expression: string): string {
    const stack: string[] = [];
    const postfixNotation: string[] = [];

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      if (char === ' ') {
        continue;
      }

      if (this.isOperator(char)) {
        while (stack.length > 0) {
          const top = stack[stack.length - 1];

          if (this.isOperator(top) && this.getPrecedence(top) >= this.getPrecedence(char)) {
            postfixNotation.push(stack.pop() as string);
          } else {
            break;
          }
        }

        stack.push(char);
      } else if (char === '(') {
        stack.push(char);
      } else if (char === ')') {
        while (stack.length > 0 && stack[stack.length - 1] !== '(') {
          postfixNotation.push(stack.pop() as string);
        }

        stack.pop();
      } else {
        let operand = '';

        while (i < expression.length && !supportedEvalOperators.includes(expression[i]) && expression[i] !== '(' && expression[i] !== ')') {
          operand += expression[i++];
        }

        postfixNotation.push(operand);
        i--;
      }
    }

    while (stack.length > 0) {
      postfixNotation.push(stack.pop() as string);
    }

    return postfixNotation.join(' ');
  }

  private getPrecedence(operator: string): number {
    switch (operator) {
      case '+':
      case '-':
        return 1;
      case '*':
      case '/':
        return 2;
      default:
        return 0;
    }
  }
  
  private evaluatePostfixNotation(postfixNotation: string): number {
    const stack: number[] = [];
    let tempNumber = '';

    for (let i = 0; i < postfixNotation.length; i++) {
      const char = postfixNotation[i];

      if (char === ' ') {
        continue;
      }

      if (this.isOperator(char)) {
        const operand2 = stack.pop() as number;
        const operand1 = stack.pop() as number;

        stack.push(this.executeBinaryOperation(operand1, operand2, char));
      } else {
        tempNumber += char;

        if (i + 1 < postfixNotation.length && postfixNotation[i + 1] !== ' ') {
          continue;
        }

        stack.push(Number(tempNumber));

        tempNumber = '';
      }
    }

    return stack.pop() as number;
  }

  private isOperator(char: string): boolean {
    return supportedEvalOperators.includes(char);
  }

  private executeBinaryOperation(operand1: number, operand2: number, operator: string): number {
    switch (operator) {
      case '+':
        return Decimal.add(operand1, operand2)
      case '-':
        return Decimal.subtract(operand1, operand2);
      case '*':
        return Decimal.multiply(operand1, operand2);
      case '/':
        if (operand2 === 0) {
          throw new ValidationException('Division by zero');
        }

        return Decimal.divide(operand1, operand2);
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  }
}
