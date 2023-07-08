/* eslint-disable no-underscore-dangle */
import * as request from 'supertest';

import { IApp, createApp } from '@application/app';
import { PostgresDataSetup } from '@test-setup/postgres-data-setup';
import { JWTHandlerAdapter } from '@external/adapters/jwt-handler-adapter';

describe('POST /dividendpayment', () => {
  let app: IApp;
  let postgresDataSetup: PostgresDataSetup;
  let accessTokens: Array<string>;

  const requestBody = {
    value: 2.00,
    assetCode: 'TEST11',
    createdAt: '2021-07-03T13:22:22.000Z',
  };

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

  it('Should submit sucessfully', (done) => {
    request(app.api)
      .post('/dividendpayment')
      .send({
        ...requestBody,
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body._value).toEqual(2);
        expect(response.body._createdAt).toEqual('2021-07-03T13:22:22.000Z');
        expect(response.body._asset._code).toEqual('TEST11');
        expect(response.body._asset._social).toEqual('Teste');
        expect(response.body._asset._category).toEqual('FII');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should return a BadRequest response when the request body is empty', (done) => {
    request(app.api)
      .post('/dividendpayment')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Some required attribute was not found');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should return a BadRequest response when the request body contains only the asset code', (done) => {
    request(app.api)
      .post('/dividendpayment')
      .send({
        assetCode: 'TEST11',
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Some required attribute was not found');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should return a NotFound response when the asset code is not found', (done) => {
    request(app.api)
      .post('/dividendpayment')
      .send({
        ...requestBody,
        assetCode: 'TEST8',
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toEqual('Asset not found');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should return a BadRequest response when the value is invalid', (done) => {
    request(app.api)
      .post('/dividendpayment')
      .send({
        ...requestBody,
        value: 'erro',
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('It was not possible create the dividend payment object!\n The value of the field "value" is not accept');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should return a BadRequest response when the date is invalid', (done) => {
    request(app.api)
      .post('/dividendpayment')
      .send({
        ...requestBody,
        createdAt: 'erro',
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('It was not possible create the dividend payments object!\n Date is invalid.');
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});
