/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { ReportInputHandler } from '@utils/report-input-handler';

class DateValidatorUtilMock implements IDateValidatorAdapter {
  isTimeInterval(begin: Date, end: Date): boolean {
    return true;
  }

  validate(date: string | Date): boolean {
    return true;
  }
}

describe('ReportInputHandler', () => {
  let reportInputHandler: ReportInputHandler;
  let dateValidatorUtilMock: DateValidatorUtilMock;
  beforeEach(() => {
    dateValidatorUtilMock = new DateValidatorUtilMock();
    reportInputHandler = new ReportInputHandler(dateValidatorUtilMock);
  });

  it('Should return the filters with 3 codes, when an asset code list is entered', () => {
    const params = {
      codes: 'TEST4,TEST3,TEST11',
    };

    const filters = reportInputHandler.handle(params);

    expect(filters.codes.length).toEqual(3);
  });

  it('Should return the filters with begin date defined, when the begin date is valid', async () => {
    const params = {
      begin: new Date(),
    };

    const filters = reportInputHandler.handle(params);
    expect(filters.begin).toBeDefined();
  });

  it('Should return the filters with end date defined, when the end date is valid', async () => {
    const params = {
      end: new Date(),
    };

    const filters = reportInputHandler.handle(params);

    expect(filters.end).toBeDefined();
  });

  it('Should throw a Bad Request Error, when begin date is invalid', async () => {
    dateValidatorUtilMock.validate = jest.fn().mockReturnValueOnce(false);

    let error;
    try {
      reportInputHandler.handle({ begin: 'invalid' });
    } catch (e) {
      error = e;
    }

    expect(error.message).toEqual('The begin date is invalid.');
    expect(error.status).toEqual('BAD_REQUEST_ERROR');
  });

  it('Should throw a Bad Request Error, when end date is invalid', async () => {
    dateValidatorUtilMock.validate = jest.fn().mockReturnValueOnce(false);

    let error;
    try {
      reportInputHandler.handle({ end: 'invalid' });
    } catch (e) {
      error = e;
    }

    expect(error.message).toEqual('The end date is invalid.');
    expect(error.status).toEqual('BAD_REQUEST_ERROR');
  });

  it('Should throw a Bad Request Error, when the date validator returns false', async () => {
    dateValidatorUtilMock.isTimeInterval = jest.fn().mockReturnValueOnce(false);
    const filters = {
      codes: [],
      begin: new Date('2021-08-01T23:00:00.000Z'),
      end: new Date('2021-01-01T23:00:00.000Z'),
    };

    let error;
    try {
      reportInputHandler.handle(filters);
    } catch (serviceError) {
      error = serviceError;
    }

    expect(error.message).toEqual('The end date is greater than begin date.');
    expect(error.status).toEqual('BAD_REQUEST_ERROR');
  });
});
