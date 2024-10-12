import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ValidationException } from '@shared/exceptions';
import { supportedEvalOperators } from '@shared/utils/config';

@Injectable()
export class EvaluationGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { body: message } = request;

    return this.validateInput(message);
  }

  private async validateInput(message: any): Promise<boolean> {
    const { expression } = message;

    if (!expression) {
      return false;
    }

    if (typeof expression !== 'string') {
      return false;
    }

    if (!this.validateExpressionSymbols(expression)) {
      const errorMessage = 'Invalid expression symbols';

      throw new ValidationException(errorMessage);
    }

    if (!this.validateExpressionBrackets(expression)) {
      const errorMessage = 'Invalid expression brackets';

      throw new ValidationException(errorMessage);
    }

    if (!this.validateToOperatorsInARow(expression)) {
      const errorMessage = 'Expression operators cannot be in a row';

      throw new ValidationException(errorMessage);
    }

    return true;
  }

  private validateExpressionSymbols(expression: string): boolean {
    return /^[0-9\+\-\*\/\(\)\s]+$/.test(expression)
  }

  private validateExpressionBrackets(expression: string): boolean {
    const stack: string[] = [];

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      if (char === '(') {
        stack.push(char);
      } else if (char === ')') {
        if (stack.length === 0) {
          return false;
        }

        stack.pop();
      }
    }

    return stack.length === 0;
  }

  private validateToOperatorsInARow(expression: string): boolean {
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      if (
        supportedEvalOperators.includes(char)
        && i + 1 < expression.length
        && supportedEvalOperators.includes(expression[i + 1])
      ) {
        return false;
      }
    }

    return true;
  }
}
