// require('ts-node').register();

import { Decimal as ExternalDecimal } from 'decimal.js';
import workerpool from 'workerpool';

const supportedEvalOperators = ['+', '-', '*', '/'];

export class Decimal {
  static add(x: number, y: number): number {
    return ExternalDecimal.add(x, y).toNumber();
  }

  static addMany(...v: number[]): number {
    return v.reduce(Decimal.add, 0);
  }

  static subtract(x: number, y: number): number {
    return ExternalDecimal.sub(x, y).toNumber();
  }

  static multiply(x: number, y: number): number {
    return ExternalDecimal.mul(x, y).toNumber();
  }

  static divide(x: number, y: number): number {
    return ExternalDecimal.div(x, y).toNumber();
  }

  static round(value: number, decimalPoints: number) {
    const factor = Math.pow(10, decimalPoints);

    return Math.round(value * factor) / factor;
  }

  static floor(value: number, decimalPoints: number) {
    const factor = Math.pow(10, decimalPoints);

    return Math.floor(value * factor) / factor;
  }
}


export interface IDecomposeEvaluationInput {
  expression: string;
};

class EvaluateInputService {
  execute(dto: IDecomposeEvaluationInput): number {
    // this.logger.log(`Processing created Ethereum transaction: ${dto.expression}`);

    const postfixNotation = this.convertToPostfixNotation(dto.expression);

    // console.log(`Reverse Polish Notation: ${postfixNotation}`);

    const result = this.evaluatePostfixNotation(postfixNotation);

    // console.log(`Result: ${result} for expression: ${dto.expression}`);

    return result;
  }

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
          // some nasty coding ; )
          operand += expression[i++];
        }

        postfixNotation.push(operand);

        // as well
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
          throw new Error('Division by zero');
        }

        return Decimal.divide(operand1, operand2);
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }
  }
}


const instance = new EvaluateInputService();

// parentPort?.on('message', (data) => {
//   console.log(`Worker data: ${workerData}`);

//   const result = instance.execute(workerData);
  
//   console.log(`Result: ${result}`);
  
//   parentPort?.postMessage(result);
// });

workerpool.worker({
  evaluateExpression: instance.execute.bind(instance)
});
