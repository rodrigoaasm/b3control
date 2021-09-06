import DateValidator from '@utils/date-validator-util';

describe('Date Validator Util', () => {
  it("Should return false when the 'date' is invalid date string. ", async () => {
    const valid = DateValidator.validate('invalid date');
    expect(valid).toBe(false);
  });

  it("Should return true when the 'date' is valid date string. ", async () => {
    const valid = DateValidator.validate('2021-09-01T13:00:01.000Z');
    expect(valid).toBe(true);
  });

  it("Should return false when the 'date' is undefined.", async () => {
    const valid = DateValidator.validate(undefined);
    expect(valid).toBe(false);
  });

  it("Should return true when the 'date' is valid date. ", async () => {
    const valid = DateValidator.validate(new Date('2021-09-01T13:00:01.000Z'));
    expect(valid).toBe(true);
  });
});
