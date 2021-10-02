import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
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
