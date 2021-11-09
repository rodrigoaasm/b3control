import * as request from 'supertest';

import { IApp, createApp } from '@application/app';
import { PostgresDataSetup } from '@test-setup/postgres-data-setup';

describe('POST /operation/submit', () => {
  let app: IApp;
  let postgresDataSetup: PostgresDataSetup;

  const requestBody = {
    assetCode: 'TEST11',
    type: 'buy',
    value: 20.18,
    quantity: 200,
    createdAt: '2021-07-03T13:22:22.000',
  };

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
        assetCode: 'TEST8',
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
