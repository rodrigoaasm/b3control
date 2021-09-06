import { isValid, parseISO } from 'date-fns';

function validate(date: any) {
  let preparedDate = date;
  if (!(date instanceof Date)) {
    preparedDate = parseISO(date as string);
  }
  return isValid(preparedDate);
}

export default {
  validate,
};
