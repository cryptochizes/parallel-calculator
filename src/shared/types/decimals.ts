import { Decimal as ExternalDecimal } from 'decimal.js';

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
