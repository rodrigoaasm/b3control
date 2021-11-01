export interface IDateValidatorAdapter {
  validate(date: Date | string): boolean;
  isTimeInterval(begin: Date, end: Date): boolean;
}
