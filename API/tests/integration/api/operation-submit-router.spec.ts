import * as request from 'supertest';

import { createApp, IApp } from '@application/app';
import config from '@test-setup/typeorm-setup';
import { PostgresMockDataSetup } from '@test-setup/postgres-mock-data';

describe('POST /operation/submit', () => {
  let app: IApp;
  let postgresSetup: PostgresMockDataSetup;
  const requestBody = {
    assetCode: 'TEST11',
    type: 'buy',
    value: 20.18,
    quantity: 200,
    createdAt: '2021-07-03T13:22:22.000',
  };

  beforeAll(async () => {
    app = await createApp(config);
    postgresSetup = new PostgresMockDataSetup(app.database);
    await postgresSetup.load();
  });

  afterAll(async () => {
    await postgresSetup.clear();
  });

  it('Should submit sucessfully', (done) => {
    request(app.api)
      .post('/operation/submit')
      .send({
        ...requestBody,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201, done);
  });

  it('Should return a BadRequest response when the request body is empty', (done) => {
    request(app.api)
      .post('/operation/submit')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('Should return a BadRequest response when the request body contains only the asset code', (done) => {
    request(app.api)
      .post('/operation/submit')
      .send({
        assetCode: 'TEST11',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('Should return a NotFound response when the asset code is not found', (done) => {
    request(app.api)
      .post('/operation/submit')
      .send({
        ...requestBody,
        assetCode: 'TEST4',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('Should return a BadRequest response when the value is invalid', (done) => {
    request(app.api)
      .post('/operation/submit')
      .send({
        ...requestBody,
        value: 'erro',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('Should return a BadRequest response when the quantity is invalid', (done) => {
    request(app.api)
      .post('/operation/submit')
      .send({
        ...requestBody,
        quantity: 'erro',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('Should return a BadRequest response when the date is invalid', (done) => {
    request(app.api)
      .post('/operation/submit')
      .send({
        ...requestBody,
        createdAt: 'erro',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});
