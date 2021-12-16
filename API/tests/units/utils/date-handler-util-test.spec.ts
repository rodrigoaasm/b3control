import DateHandlerUtil from '@utils/date-handler-util';

describe('Date Handler Util', () => {
  let dateHandlerUtil: DateHandlerUtil;
  beforeEach(() => {
    dateHandlerUtil = new DateHandlerUtil();
  });

  it('Should return a valid date when a full format date was entered', async () => {
    const received = dateHandlerUtil.parse(
      '2000-01-01 13:00:00',
      'yyyy-MM-dd HH:mm:ss',
    );
    expect(new Date('2000-01-01T13:00:00.000')).toEqual(received);
  });

  it('Should return a valid date when a partial format date was entered', async () => {
    const received = dateHandlerUtil.parse(
      '2000-01',
      'yyyy-MM',
    );
    expect(new Date('2000-01-01T00:00:00.000')).toEqual(received);
  });

  it('Should throw an error when the date string does not follow the format', async () => {
    expect.assertions(1);
    try {
      dateHandlerUtil.parse(
        '2000-01-01T13:00:00',
        'yyyy-MM-dd HH:mm:ss',
      );
    } catch (parseError) {
      expect(parseError.message).toEqual('The string that was entered does not match the date format acceptable');
    }
  });

  it('Should format a date following the full date format', () => {
    const dateLabel = dateHandlerUtil.format(new Date('2021-01-01T03:00:00.000z'), 'yyyy-MM-dd HH:mm:ss');
    expect(dateLabel).toEqual('2021-01-01 00:00:00');
  });

  it('Should throw a error when date is invalid', () => {
    try {
      dateHandlerUtil.format(new Date(NaN), 'yyyy-MM-dd HH:mm:ss');
    } catch (formatError) {
      expect(formatError).toBeDefined();
    }

    expect.assertions(1);
  });

  it('Should return the difference between dates in milliseconds', () => {
    const dateLeft = new Date('2021-02-01T13:00:00.200Z');
    const dateRight = new Date('2021-02-01T13:00:00.500Z');

    const diff = dateHandlerUtil.dateDiff('Milliseconds', dateLeft, dateRight);

    expect(diff).toEqual(-300);
  });

  it('Should return the difference between dates in seconds', () => {
    const dateLeft = new Date('2021-02-01T13:00:10.000Z');
    const dateRight = new Date('2021-02-01T13:00:22.000Z');

    const diff = dateHandlerUtil.dateDiff('Seconds', dateLeft, dateRight);

    expect(diff).toEqual(-12);
  });

  it('Should return the difference between dates in minutes', () => {
    const dateLeft = new Date('2021-02-01T13:08:00.000Z');
    const dateRight = new Date('2021-02-01T13:20:00.000Z');

    const diff = dateHandlerUtil.dateDiff('Minutes', dateLeft, dateRight);

    expect(diff).toEqual(-12);
  });

  it('Should return the difference between dates in hours', () => {
    const dateLeft = new Date('2021-02-01T13:00:00.000Z');
    const dateRight = new Date('2021-02-01T15:00:00.000Z');

    const diff = dateHandlerUtil.dateDiff('Hours', dateLeft, dateRight);

    expect(diff).toEqual(-2);
  });

  it('Should return the difference between dates in days', () => {
    const dateLeft = new Date('2021-02-01T13:00:00.000Z');
    const dateRight = new Date('2021-02-04T13:00:00.000Z');

    const diff = dateHandlerUtil.dateDiff('Days', dateLeft, dateRight);

    expect(diff).toEqual(-3);
  });

  it('Should return the difference between dates in weeks', () => {
    const dateLeft = new Date('2021-02-01T13:00:00.000Z');
    const dateRight = new Date('2021-02-16T13:00:00.000Z');

    const diff = dateHandlerUtil.dateDiff('Weeks', dateLeft, dateRight);

    expect(diff).toEqual(-2);
  });

  it('Should return the difference between dates in months', () => {
    const dateLeft = new Date('2021-02-01T13:00:00.000Z');
    const dateRight = new Date('2021-04-04T13:00:00.000Z');

    const diff = dateHandlerUtil.dateDiff('Months', dateLeft, dateRight);

    expect(diff).toEqual(-2);
  });

  it('Should return the difference between dates in Years', () => {
    const dateLeft = new Date('2021-02-01T13:00:00.000Z');
    const dateRight = new Date('2022-04-04T13:00:00.000Z');

    const diff = dateHandlerUtil.dateDiff('Years', dateLeft, dateRight);

    expect(diff).toEqual(-1);
  });

  it('Should throw a error when format is invalid', () => {
    try {
      dateHandlerUtil.format(new Date('2021-01-01T03:00:00.000z'), 'invalid');
    } catch (formatError) {
      expect(formatError).toBeDefined();
    }

    expect.assertions(1);
  });

  it("Should return false when the 'date' is invalid date string. ", async () => {
    const valid = dateHandlerUtil.validate('invalid date');
    expect(valid).toBe(false);
  });

  it("Should return true when the 'date' is valid date string. ", async () => {
    const valid = dateHandlerUtil.validate('2021-09-01T13:00:01.000Z');
    expect(valid).toBe(true);
  });

  it("Should return false when the 'date' is undefined.", async () => {
    const valid = dateHandlerUtil.validate(undefined);
    expect(valid).toBe(false);
  });

  it("Should return true when the 'date' is valid date. ", async () => {
    const valid = dateHandlerUtil.validate(new Date('2021-09-01T13:00:01.000Z'));
    expect(valid).toBe(true);
  });

  it("Should return true when the 'time interval' is valid. ", async () => {
    const valid = dateHandlerUtil.isTimeInterval(new Date('2021-09-01T13:00:01.000Z'), new Date('2021-09-03T13:00:01.000Z'));
    expect(valid).toBe(true);
  });

  it("Should return false when the 'time interval' is not valid. ", async () => {
    const valid = dateHandlerUtil.isTimeInterval(new Date('2021-09-03T13:00:01.000Z'), new Date('2021-09-01T13:00:01.000Z'));
    expect(valid).toBe(false);
  });
});
