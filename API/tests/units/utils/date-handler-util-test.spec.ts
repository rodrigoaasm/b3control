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
      expect(parseError.message).toEqual('The string that was entered does not match the format entered');
    }
  });
});
