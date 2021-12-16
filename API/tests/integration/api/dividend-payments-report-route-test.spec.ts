import * as request from 'supertest';

import { IApp, createApp } from '@application/app';
import { PostgresDataSetup } from '@test-setup/postgres-data-setup';
import { DateHandlerUtil } from '@utils/date-handler-util';

describe('GET /report/dividendpayments/...', () => {
  let app: IApp;
  let postgresDataSetup: PostgresDataSetup;

  const dateHandlerUtil = new DateHandlerUtil();
  const diffInMonths = dateHandlerUtil.dateDiff('Months', new Date(), new Date('2021-02-01T03:00:00.000Z')) + 1;
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const correctedValues = new Map<string, number>();
  correctedValues.set('TEST11-2021-01-01T03:00:00.000Z', 7);
  correctedValues.set('TEST11-2021-02-01T03:00:00.000Z', 7);
  correctedValues.set('TEST11-2021-03-01T03:00:00.000Z', 7);
  correctedValues.set(`TEST11-${currentMonth.toISOString()}`, 12);

  correctedValues.set('TEST4-2021-01-01T03:00:00.000Z', 0);
  correctedValues.set('TEST4-2021-02-01T03:00:00.000Z', 0);
  correctedValues.set('TEST4-2021-03-01T03:00:00.000Z', 0);
  correctedValues.set(`TEST4-${currentMonth.toISOString()}`, 0);

  correctedValues.set('TEST3-2021-01-01T03:00:00.000Z', 5);
  correctedValues.set('TEST3-2021-02-01T03:00:00.000Z', 0);
  correctedValues.set('TEST3-2021-03-01T03:00:00.000Z', 5);
  correctedValues.set(`TEST3-${currentMonth.toISOString()}`, 10);

  correctedValues.set('general-2021-01-01T03:00:00.000Z', 7);
  correctedValues.set('general-2021-02-01T03:00:00.000Z', 7);
  correctedValues.set('general-2021-03-01T03:00:00.000Z', 7);
  correctedValues.set(`general-${currentMonth.toISOString()}`, 12);

  correctedValues.set('stock-2021-01-01T03:00:00.000Z', 5);
  correctedValues.set('stock-2021-02-01T03:00:00.000Z', 0);
  correctedValues.set('stock-2021-03-01T03:00:00.000Z', 5);
  correctedValues.set(`stock-${currentMonth.toISOString()}`, 10);

  function checkPaymentCalculations(response: any, nAssetPositions: number): any {
    response.body.assets.forEach((asset: any) => {
      expect(asset.items.length).toEqual(nAssetPositions);
      asset.items.forEach((monthlyPayment: any) => {
        const expectValue = correctedValues.get(`${asset.name}-${monthlyPayment.date}`);
        expect(monthlyPayment.value).toEqual(expectValue ?? 0);
      });
    });
  }

  beforeAll(async () => {
    postgresDataSetup = new PostgresDataSetup();
    await postgresDataSetup.init();
    await postgresDataSetup.up();
    app = await createApp(postgresDataSetup.getConnection());
  });

  afterAll(async () => {
    await postgresDataSetup.down();
    await postgresDataSetup.getConnection().close();
    app = null;
  });

  it('Should reply payments of 0 amount when no dates are set', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/begin/2010-01/end/2010-06')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(3);
        response.body.assets.forEach((asset: any) => {
          expect(asset.items.length).toEqual(6);
          asset.items.forEach((item: any) => {
            expect(item.value).toEqual(0);
          });
        });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply bad request http response, when the begin date is greater than now ', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/begin/2222-01/end')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The end date is greater than begin date.');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply bad request http response, when the end date is less than now ', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/begin/end/2000-01')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The end date is greater than begin date.');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should return the payments of this month when the time interval is not entered', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/begin/end/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(3);
        checkPaymentCalculations(response, 1);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with all data after a month when the begin month is entered ', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/begin/2021-02/end')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        // Checks the amount of assets
        expect(response.body.assets.length).toEqual(3);
        expect(response.body.categories.length).toEqual(2);
        checkPaymentCalculations(response, diffInMonths);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with a bad request http response when the begin date is invalid', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/begin/invalid/end')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The string that was entered does not match the date format acceptable');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with all data between the current month and the end month, when only the end date is entered', (done) => {
    const endDate = new Date(currentMonth);
    endDate.setMonth(endDate.getMonth() + 1);

    request(app.api)
      .get(`/report/dividendpayments/codes/begin/end/${dateHandlerUtil.format(endDate, 'yyyy-MM')}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        // Checks the amount of assets
        expect(response.body.assets.length).toEqual(3);
        response.body.assets.forEach((asset) => {
          expect(asset.items.length).toEqual(2);
        });
        expect(response.body.categories.length).toEqual(2);
        response.body.categories.forEach((category) => {
          expect(category.items.length).toEqual(2);
        });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply http bad request when the entered end date is less than now', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/begin/end/2021-03')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The end date is greater than begin date.');
        expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with a bad request http response when the end date is invalid', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/begin/end/invalid')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The string that was entered does not match the date format acceptable');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with all data within the time interval when a time interval is entered', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/begin/2021-02/end/2021-03')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        // Checks the amount of assets
        expect(response.body.assets.length).toEqual(3);
        expect(response.body.categories.length).toEqual(2);
        checkPaymentCalculations(response, 2);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with a bad request http response when the time interval is invalid', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/begin/2021-02/end/2021-01')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The end date is greater than begin date.');
        expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with just one asset when the code is entered', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/TEST11/begin/end')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(1);
        expect(response.body.categories.length).toEqual(1);
        checkPaymentCalculations(response, 1);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with just one asset and its payments after a date when code and begin date are entered', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/TEST11/begin/2021-02/end')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(1);
        expect(response.body.categories.length).toEqual(1);
        checkPaymentCalculations(response, diffInMonths);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with data for only one asset between the current month and the end month, when the end date and the codes are entered.', (done) => {
    const endDate = new Date(currentMonth);
    endDate.setMonth(endDate.getMonth() + 1);

    request(app.api)
      .get(`/report/dividendpayments/codes/TEST11/begin/end/${dateHandlerUtil.format(endDate, 'yyyy-MM')}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        // Checks the amount of assets
        expect(response.body.assets.length).toEqual(1);
        response.body.assets.forEach((asset) => {
          expect(asset.items.length).toEqual(2);
        });
        expect(response.body.categories.length).toEqual(1);
        response.body.categories.forEach((category) => {
          expect(category.items.length).toEqual(2);
        });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply http bad request when the end date is less than now and the "codes" filter is entered', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/TEST11/begin/end/2021-03')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The end date is greater than begin date.');
        expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with just one asset and its payments within the time interval when a time interval and the code are entered', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/TEST11/begin/2021-02/end/2021-03')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(1);
        expect(response.body.categories.length).toEqual(1);
        checkPaymentCalculations(response, 2);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with two assets when two codes are entered', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/TEST11,TEST4/begin/end')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(2);
        expect(response.body.categories.length).toEqual(2);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});
