import { EntityConstructionError } from '@domain-error/custom-error';
import { IDateHandlerAdapter } from '@domain-ports/adapters/date-handler-adapter-interface';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { parse, parseISO, isValid } from 'date-fns';

export class DateHandlerUtil implements IDateHandlerAdapter, IDateValidatorAdapter {
  // eslint-disable-next-line class-methods-use-this
  parse(dateString: string, format: string): Date {
    const date = parse(dateString, format, new Date());
    if (date.toString() === 'Invalid Date') {
      throw EntityConstructionError('The string that was entered does not match the date format acceptable');
    }

    return date;
  }

  // eslint-disable-next-line class-methods-use-this
  isTimeInterval(begin: Date, end: Date) {
    return end.getTime() >= begin.getTime();
  }

  // eslint-disable-next-line class-methods-use-this
  validate(date: string | Date): boolean {
    let preparedDate = date;
    if (!(date instanceof Date)) {
      preparedDate = parseISO(date as string);
    }
    return isValid(preparedDate);
  }
}

export default DateHandlerUtil;
