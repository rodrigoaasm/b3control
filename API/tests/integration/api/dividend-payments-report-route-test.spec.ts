import * as request from 'supertest';

import { IApp, createApp } from '@application/app';
import { PostgresDataSetup } from '@test-setup/postgres-data-setup';

describe('GET /report/dividendpayments/...', () => {
  let app: IApp;
  let postgresDataSetup: PostgresDataSetup;

  const correctedValues = new Map<string, number>();
  correctedValues.set('TEST11-2020-01-01T00:00:00.000Z', 7);
  correctedValues.set('TEST11-2020-02-01T00:00:00.000Z', 7);
  correctedValues.set('TEST11-2020-03-01T00:00:00.000Z', 7);

  correctedValues.set('TEST4-2020-01-01T00:00:00.000Z', 0);
  correctedValues.set('TEST4-2020-02-01T00:00:00.000Z', 0);
  correctedValues.set('TEST4-2020-03-01T00:00:00.000Z', 0);

  correctedValues.set('TEST3-2020-01-01T00:00:00.000Z', 5);
  correctedValues.set('TEST3-2020-02-01T00:00:00.000Z', 0);
  correctedValues.set('TEST3-2020-03-01T00:00:00.000Z', 5);

  correctedValues.set('general-2020-01-01T00:00:00.000Z', 7);
  correctedValues.set('general-2020-02-01T00:00:00.000Z', 7);
  correctedValues.set('general-2020-03-01T00:00:00.000Z', 7);

  correctedValues.set('stock-2020-01-01T00:00:00.000Z', 5);
  correctedValues.set('stock-2020-02-01T00:00:00.000Z', 0);
  correctedValues.set('stock-2020-03-01T00:00:00.000Z', 5);

  function checkPaymentCalculations(response: any, nAssetPositions: number): any {
    response.body.assets.forEach((asset: any) => {
      expect(asset.itens.length).toEqual(nAssetPositions);
      asset.itens.forEach((monthlyPayment: any) => {
        expect(monthlyPayment.value).toEqual(correctedValues.get(`${asset.name}-${monthlyPayment.date}`));
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

  it('Should reply payments of 0 amount when when no dates are set', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/begin/end')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        response.body.assets.forEach((asset: any) => {
          expect(asset.items.length).toEqual(1);
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
      .get('/report/dividendpayments/codes/begin/2222-01-01T13:00:00.000Z/end')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The begin date is greater than end date.');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply bad request http response, when the end date is less than now ', (done) => {
    request(app.api)
      .get('/report/dividendpayments/codes/begin/end/2000-01-01T13:00:00.000Z')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The begin date is greater than end date.');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  // it('Should reply with all data after a date when the begin date is entered ', (done) => {
  //   request(app.api)
  //     .get('/report/stocktimeline/codes/begin/2020-02-01T13:00:00.000Z/end')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .then((response) => {
  //       // Checks the amount of assets
  //       expect(response.body.assets.length).toEqual(3);
  //       expect(response.body.categories.length).toEqual(2);
  //       checkCalculations(response, 2, 2);
  //       done();
  //     })
  //     .catch((error) => {
  //       done(error);
  //     });
  // });

  // it('Should reply with a bad request http response when the begin date is invalid', (done) => {
  //   request(app.api)
  //     .get('/report/stocktimeline/codes/begin/invalid/end')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(400)
  //     .then((response) => {
  //       expect(response.body.message).toEqual('The begin date is invalid.');
  //       expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
  //       done();
  //     })
  //     .catch((error) => {
  //       done(error);
  //     });
  // });

  // it('Should reply with all data before a date when the end date is entered', (done) => {
  //   request(app.api)
  //     .get('/report/stocktimeline/codes/begin/end/2020-03-01T13:00:00.000Z')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .then((response) => {
  //       // Checks the amount of assets
  //       expect(response.body.assets.length).toEqual(3);
  //       expect(response.body.categories.length).toEqual(2);
  //       checkCalculations(response, 2, 2);
  //       done();
  //     })
  //     .catch((error) => {
  //       done(error);
  //     });
  // });

  // it('Should reply with a bad request http response when the end date is invalid', (done) => {
  //   request(app.api)
  //     .get('/report/stocktimeline/codes/begin/end/invalid')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(400)
  //     .then((response) => {
  //       expect(response.body.message).toEqual('The end date is invalid.');
  //       expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
  //       done();
  //     })
  //     .catch((error) => {
  //       done(error);
  //     });
  // });

  // it('Should reply with all data within the time interval when a time interval is entered', (done) => {
  //   request(app.api)
  //     .get('/report/stocktimeline/codes/begin/2020-02-01T13:00:00.000Z/end/2020-03-01T13:00:00.000Z')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .then((response) => {
  //       // Checks the amount of assets
  //       expect(response.body.assets.length).toEqual(3);
  //       expect(response.body.categories.length).toEqual(2);
  //       checkCalculations(response, 1, 1);
  //       done();
  //     })
  //     .catch((error) => {
  //       done(error);
  //     });
  // });

  // it('Should reply with a bad request http response when the time interval is invalid', (done) => {
  //   request(app.api)
  //     .get('/report/stocktimeline/codes/begin/2020-02-01T13:00:00.000Z/end/2020-01-01T13:00:00.000Z')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(400)
  //     .then((response) => {
  //       expect(response.body.message).toEqual('The end date is greater than begin date.');
  //       expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
  //       done();
  //     })
  //     .catch((error) => {
  //       done(error);
  //     });
  // });

  // it('Should reply with just one asset when the code is entered', (done) => {
  //   request(app.api)
  //     .get('/report/stocktimeline/codes/TEST11/begin/end')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.body.assets.length).toEqual(1);
  //       expect(response.body.categories.length).toEqual(1);
  //       checkCalculations(response, 3, 3);
  //       done();
  //     })
  //     .catch((error) => {
  //       done(error);
  //     });
  // });

  // it('Should reply with just one asset and its positions after a date when code and begin date are entered', (done) => {
  //   request(app.api)
  //     .get('/report/stocktimeline/codes/TEST11/begin/2020-02-01T13:00:00.000Z/end')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.body.assets.length).toEqual(1);
  //       expect(response.body.categories.length).toEqual(1);
  //       checkCalculations(response, 2, 2);
  //       done();
  //     })
  //     .catch((error) => {
  //       done(error);
  //     });
  // });

  // it('Should reply with just one asset and its positions before a date when code and end date are entered', (done) => {
  //   request(app.api)
  //     .get('/report/stocktimeline/codes/TEST11/begin/end/2020-03-01T13:00:00.000Z')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.body.assets.length).toEqual(1);
  //       expect(response.body.categories.length).toEqual(1);
  //       checkCalculations(response, 2, 2);
  //       done();
  //     })
  //     .catch((error) => {
  //       done(error);
  //     });
  // });

  // it('Should reply with just one asset and its positions within the time interval when a time interval and the code are entered', (done) => {
  //   request(app.api)
  //     .get('/report/stocktimeline/codes/TEST11/begin/2020-02-02T13:00:00.000Z/end/2020-03-01T13:00:00.000Z')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.body.assets.length).toEqual(1);
  //       expect(response.body.categories.length).toEqual(1);
  //       checkCalculations(response, 1, 1);
  //       done();
  //     })
  //     .catch((error) => {
  //       done(error);
  //     });
  // });

  // it('Should reply with two assets when two codes are entered', (done) => {
  //   request(app.api)
  //     .get('/report/stocktimeline/codes/TEST11,TEST4/begin/end')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.body.assets.length).toEqual(2);
  //       expect(response.body.categories.length).toEqual(2);
  //       checkAssetCalculations(response, 3);

  //       const correctedValuesForTwoCodesCase = new Map();
  //       correctedValuesForTwoCodesCase.set('general-2020-01-31T00:00:00.000Z', 960);
  //       correctedValuesForTwoCodesCase.set('general-2020-02-28T00:00:00.000Z', 640);
  //       correctedValuesForTwoCodesCase.set('general-2020-03-30T00:00:00.000Z', 0);

  //       correctedValuesForTwoCodesCase.set('stock-2020-01-31T00:00:00.000Z', 0);
  //       correctedValuesForTwoCodesCase.set('stock-2020-02-28T00:00:00.000Z', 1400);
  //       correctedValuesForTwoCodesCase.set('stock-2020-03-30T00:00:00.000Z', 720);

  //       // Checks Categories calculations
  //       response.body.categories.forEach((category: any) => {
  //         expect(category.positions.length).toEqual(3);
  //         category.positions.forEach((position: any) => {
  //           expect(position.value).toEqual(correctedValuesForTwoCodesCase.get(`${category.name}-${position.date}`));
  //         });
  //       });

  //       done();
  //     })
  //     .catch((error) => {
  //       done(error);
  //     });
  // });

  // it('Should reply with empty response when the asset is not found', (done) => {
  //   request(app.api)
  //     .get('/report/stocktimeline/codes/TEST8/begin/end')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.body.assets.length).toEqual(0);
  //       expect(response.body.categories.length).toEqual(0);
  //       done();
  //     })
  //     .catch((error) => {
  //       done(error);
  //     });
  // });
});
