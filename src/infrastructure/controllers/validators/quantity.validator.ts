import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class QuantityValidator implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const amount = parseFloat(value);
    if (isNaN(amount)) {
      return false;
    }

    return Number.isFinite(value);
  }
}
