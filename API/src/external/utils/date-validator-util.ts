import { IDateValidatorAdapter } from '@domain-ports/adapters/idate-validator-adapter';
import { isValid, parseISO } from 'date-fns';

export class DateValidatorUtil implements IDateValidatorAdapter {
  // eslint-disable-next-line class-methods-use-this
  validate(date: string | Date): boolean {
    let preparedDate = date;
    if (!(date instanceof Date)) {
      preparedDate = parseISO(date as string);
    }
    return isValid(preparedDate);
  }
}

export default DateValidatorUtil;
