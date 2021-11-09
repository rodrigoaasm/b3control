import DateValidatorUtil from '@utils/date-validator-util';

describe('Date Validator Util', () => {
  let dateValidatorUtil: DateValidatorUtil;
  beforeEach(() => {
    dateValidatorUtil = new DateValidatorUtil();
  });

  it("Should return false when the 'date' is invalid date string. ", async () => {
    const valid = dateValidatorUtil.validate('invalid date');
    expect(valid).toBe(false);
  });

  it("Should return true when the 'date' is valid date string. ", async () => {
    const valid = dateValidatorUtil.validate('2021-09-01T13:00:01.000Z');
    expect(valid).toBe(true);
  });

  it("Should return false when the 'date' is undefined.", async () => {
    const valid = dateValidatorUtil.validate(undefined);
    expect(valid).toBe(false);
  });

  it("Should return true when the 'date' is valid date. ", async () => {
    const valid = dateValidatorUtil.validate(new Date('2021-09-01T13:00:01.000Z'));
    expect(valid).toBe(true);
  });

  it("Should return true when the 'time interval' is valid. ", async () => {
    const valid = dateValidatorUtil.isTimeInterval(new Date('2021-09-01T13:00:01.000Z'), new Date('2021-09-03T13:00:01.000Z'));
    expect(valid).toBe(true);
  });

  it("Should return false when the 'time interval' is not valid. ", async () => {
    const valid = dateValidatorUtil.isTimeInterval(new Date('2021-09-03T13:00:01.000Z'), new Date('2021-09-01T13:00:01.000Z'));
    expect(valid).toBe(false);
  });
});
