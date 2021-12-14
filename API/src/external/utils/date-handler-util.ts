import { EntityConstructionError } from '@domain-error/custom-error';
import { IDateHandlerAdapter } from '@domain-ports/adapters/date-handler-adapter-interface';
import { parse } from 'date-fns';

export class DateHandlerUtil implements IDateHandlerAdapter {
  // eslint-disable-next-line class-methods-use-this
  parse(dateString: string, format: string): Date {
    const date = parse(dateString, format, new Date());
    if (date.toString() === 'Invalid Date') {
      throw EntityConstructionError('The string that was entered does not match the date format acceptable');
    }

    return date;
  }
}

export default DateHandlerUtil;
