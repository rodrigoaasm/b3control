import * as request from 'supertest';

import { IApp, createApp } from '@application/app';
import { PostgresDataSetup } from '@test-setup/postgres-data-setup';
import { JWTHandlerAdapter } from '@external/adapters/jwt-handler-adapter';

describe('GET /report/assettimeline/...', () => {
  let app: IApp;
  let postgresDataSetup: PostgresDataSetup;
  let accessTokens: Array<string>;

  // results
  const correctedValues = new Map<string, number>();
  correctedValues.set('TEST11-2020-01-31T17:00:00.000Z', 960);
  correctedValues.set('TEST11-2020-02-28T17:00:00.000Z', 640);
  correctedValues.set('TEST11-2020-03-30T17:00:00.000Z', 0);

  correctedValues.set('TEST4-2020-01-31T17:00:00.000Z', 0);
  correctedValues.set('TEST4-2020-02-28T17:00:00.000Z', 1400);
  correctedValues.set('TEST4-2020-03-30T17:00:00.000Z', 720);

  correctedValues.set('TEST3-2020-01-31T17:00:00.000Z', 480);
  correctedValues.set('TEST3-2020-02-28T17:00:00.000Z', 800);
  correctedValues.set('TEST3-2020-03-30T17:00:00.000Z', 320);

  correctedValues.set('general-2020-01-31T17:00:00.000Z', 960);
  correctedValues.set('general-2020-02-28T17:00:00.000Z', 640);
  correctedValues.set('general-2020-03-30T17:00:00.000Z', 0);

  correctedValues.set('stock-2020-01-31T17:00:00.000Z', 480);
  correctedValues.set('stock-2020-02-28T17:00:00.000Z', 2200);
  correctedValues.set('stock-2020-03-30T17:00:00.000Z', 1040);

  function checkAssetCalculations(response: any, nAssetPositions: number): any {
    response.body.assets.forEach((asset: any) => {
      expect(asset.items.length).toEqual(nAssetPositions);
      asset.items.forEach((position: any) => {
        expect(position.value).toEqual(correctedValues.get(`${asset.name}-${position.date}`));
      });
    });
  }

  function checkCalculations(
    response: any, nAssetPositions: number, nCategoriesPositions: number,
  ): void {
    // Checks the positions
    checkAssetCalculations(response, nAssetPositions);
    // Checks the categories
    response.body.categories.forEach((category: any) => {
      expect(category.items.length).toEqual(nCategoriesPositions);
      category.items.forEach((position: any) => {
        expect(position.value).toEqual(correctedValues.get(`${category.name}-${position.date}`));
      });
    });
  }

  beforeAll(async () => {
    postgresDataSetup = new PostgresDataSetup();
    await postgresDataSetup.init();
    await postgresDataSetup.up();
    app = await createApp(postgresDataSetup.getConnection());

    // generate access tokens
    const jwtHandler = new JWTHandlerAdapter();
    accessTokens = [];
    accessTokens.push(
      jwtHandler.generateToken({ id: postgresDataSetup.registeredUsers[0].id }),
    );
    accessTokens.push(
      jwtHandler.generateToken({ id: postgresDataSetup.registeredUsers[1].id }),
    );
  });

  afterAll(async () => {
    await postgresDataSetup.down();
    await postgresDataSetup.getConnection().close();
    app = null;
  });

  it('Should reply with all data when no filter is entered', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/begin/end')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(3);
        expect(response.body.categories.length).toEqual(2);
        checkCalculations(response, 3, 3);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with all data after a date when the begin date is entered ', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/begin/2020-02-01T13:00:00.000Z/end')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        // Checks the amount of assets
        expect(response.body.assets.length).toEqual(3);
        expect(response.body.categories.length).toEqual(2);
        checkCalculations(response, 2, 2);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with a bad request http response when the begin date is invalid', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/begin/invalid/end')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The begin date is invalid.');
        expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with all data before a date when the end date is entered', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/begin/end/2020-03-01T13:00:00.000Z')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        // Checks the amount of assets
        expect(response.body.assets.length).toEqual(3);
        expect(response.body.categories.length).toEqual(2);
        checkCalculations(response, 2, 2);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with a bad request http response when the end date is invalid', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/begin/end/invalid')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The end date is invalid.');
        expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with all data within the time interval when a time interval is entered', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/begin/2020-02-01T13:00:00.000Z/end/2020-03-01T13:00:00.000Z')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        // Checks the amount of assets
        expect(response.body.assets.length).toEqual(3);
        expect(response.body.categories.length).toEqual(2);
        checkCalculations(response, 1, 1);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with a bad request http response when the time interval is invalid', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/begin/2020-02-01T13:00:00.000Z/end/2020-01-01T13:00:00.000Z')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The begin date is greater than end date.');
        expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with just one asset when the code is entered', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/TEST11/begin/end')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(1);
        expect(response.body.categories.length).toEqual(1);
        checkCalculations(response, 3, 3);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with just one asset and its positions after a date when code and begin date are entered', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/TEST11/begin/2020-02-01T13:00:00.000Z/end')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(1);
        expect(response.body.categories.length).toEqual(1);
        checkCalculations(response, 2, 2);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with just one asset and its positions before a date when code and end date are entered', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/TEST11/begin/end/2020-03-01T13:00:00.000Z')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(1);
        expect(response.body.categories.length).toEqual(1);
        checkCalculations(response, 2, 2);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with just one asset and its positions within the time interval when a time interval and the code are entered', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/TEST11/begin/2020-02-02T13:00:00.000Z/end/2020-03-01T13:00:00.000Z')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(1);
        expect(response.body.categories.length).toEqual(1);
        checkCalculations(response, 1, 1);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with two assets when two codes are entered', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/TEST11,TEST4/begin/end')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(2);
        expect(response.body.categories.length).toEqual(2);
        checkAssetCalculations(response, 3);

        const correctedValuesForTwoCodesCase = new Map();
        correctedValuesForTwoCodesCase.set('general-2020-01-31T17:00:00.000Z', 960);
        correctedValuesForTwoCodesCase.set('general-2020-02-28T17:00:00.000Z', 640);
        correctedValuesForTwoCodesCase.set('general-2020-03-30T17:00:00.000Z', 0);

        correctedValuesForTwoCodesCase.set('stock-2020-01-31T17:00:00.000Z', 0);
        correctedValuesForTwoCodesCase.set('stock-2020-02-28T17:00:00.000Z', 1400);
        correctedValuesForTwoCodesCase.set('stock-2020-03-30T17:00:00.000Z', 720);

        // Checks Categories calculations
        response.body.categories.forEach((category: any) => {
          expect(category.items.length).toEqual(3);
          category.items.forEach((position: any) => {
            expect(position.value).toEqual(correctedValuesForTwoCodesCase.get(`${category.name}-${position.date}`));
          });
        });

        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should reply with empty response when the asset is not found', (done) => {
    request(app.api)
      .get('/report/assettimeseries/codes/TEST8/begin/end')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.assets.length).toEqual(0);
        expect(response.body.categories.length).toEqual(0);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});
