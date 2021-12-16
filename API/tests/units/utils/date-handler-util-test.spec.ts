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
