import * as request from 'supertest';

import { IApp, createApp } from '@application/app';
import { PostgresDataSetup } from '@test-setup/postgres-data-setup';
import { JWTHandlerAdapter } from '@external/adapters/jwt-handler-adapter';
import PostgresQueryExec from '@test-setup/postgres-query-exec';
import { OperationFactory } from '@entities/operation';
import DateHandlerUtil from '@utils/date-handler-util';

// Mock OperationRepository
const { OperationRepository } = jest.requireActual('@external/datasource/relational/repositories/operation-repository');
const mockApp = {
  mockOperationRepository: undefined,
};
jest.mock('@external/datasource/relational/repositories/operation-repository', () => ({
  OperationRepository: jest.fn().mockImplementation(() => mockApp.mockOperationRepository),
}));

describe('POST /operation', () => {
  let app: IApp;
  let postgresDataSetup: PostgresDataSetup;
  let postgresQueryExec: PostgresQueryExec;
  let accessTokens: Array<string>;

  const requestBody = {
    assetCode: 'TEST11',
    type: 'buy',
    value: 20.18,
    quantity: 200,
    createdAt: '2021-07-03T13:22:22.000',
  };

  beforeAll(async () => {
    // prepare postgres
    postgresDataSetup = new PostgresDataSetup();
    await postgresDataSetup.init();
    await postgresDataSetup.up();
    postgresQueryExec = new PostgresQueryExec(postgresDataSetup);

    // mock
    mockApp.mockOperationRepository = new OperationRepository(
      postgresDataSetup.getConnection(),
      new OperationFactory(new DateHandlerUtil()),
    );
    mockApp.mockOperationRepository.save = jest.fn(mockApp.mockOperationRepository.save);

    // create app
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

  it('Should submit successfully when user current position already exists', (done) => {
    request(app.api)
      .post('/operation')
      .send({
        ...requestBody,
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(async (response) => {
        expect(response.status).toEqual(201);
        const currentPositions = await postgresQueryExec.getUserCurrentPosition('TEST11', postgresDataSetup.registeredUsers[0].id);
        expect(currentPositions).toHaveLength(1);
        expect(currentPositions[0].quantity).toEqual(200);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should submit successfully when the user current position does not exist', (done) => {
    request(app.api)
      .post('/operation')
      .send({
        ...requestBody,
        assetCode: 'TEST12',
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(async (response) => {
        expect(response.status).toEqual(201);
        const currentPositions = await postgresQueryExec.getUserCurrentPosition('TEST12', postgresDataSetup.registeredUsers[0].id);
        expect(currentPositions).toHaveLength(1);
        expect(currentPositions[0].quantity).toEqual(200);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('Should return a BadRequest response when the request body is empty', (done) => {
    request(app.api)
      .post('/operation')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('Should return a BadRequest response when the request body contains only the asset code', (done) => {
    request(app.api)
      .post('/operation')
      .send({
        assetCode: 'TEST11',
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('Should return a NotFound response when the asset code is not found', (done) => {
    request(app.api)
      .post('/operation')
      .send({
        ...requestBody,
        assetCode: 'TEST8',
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('Should return a BadRequest response when the value is invalid', (done) => {
    request(app.api)
      .post('/operation')
      .send({
        ...requestBody,
        value: 'erro',
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('Should return a BadRequest response when the quantity is invalid', (done) => {
    request(app.api)
      .post('/operation')
      .send({
        ...requestBody,
        quantity: 'erro',
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ message: 'Quantity is invalid', status: 'BAD_REQUEST_ERROR' });
        done();
      })
      .catch((error) => done(error));
  });

  it('Should return a BadRequest response when the current position is not found in a sales request ', (done) => {
    request(app.api)
      .post('/operation')
      .send({
        ...requestBody,
        assetCode: 'TEST13',
        type: 'sale',
        quantity: 300,
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
          message: "It was not possible set a quantity in the position object!\n The value of the field 'quantity' is not accept",
          status: 'ENTITY_CONSTRUCTION_ERROR',
        });
        done();
      })
      .catch((error) => done(error));
  });

  it('Should return a BadRequest response when the quantity entered in a sales request is greater than the current position', (done) => {
    request(app.api)
      .post('/operation')
      .send({
        ...requestBody,
        assetCode: 'TEST12',
        type: 'sale',
        quantity: 300,
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
          message: "It was not possible set a quantity in the position object!\n The value of the field 'quantity' is not accept",
          status: 'ENTITY_CONSTRUCTION_ERROR',
        });
        done();
      })
      .catch((error) => done(error));
  });

  it('Should return a BadRequest response when the date is invalid', (done) => {
    request(app.api)
      .post('/operation')
      .send({
        ...requestBody,
        createdAt: 'erro',
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('Should return an internal server error response and not keep log of the new position when the transaction fails', (done) => {
    mockApp.mockOperationRepository.save.mockRejectedValueOnce(new Error('Database Error'));

    request(app.api)
      .post('/operation')
      .send({
        ...requestBody,
        assetCode: 'TEST13',
      })
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(async (response) => {
        expect(response.status).toEqual(500);
        expect(response.body).toEqual({
          message: 'There is an error in transaction',
          status: 'DATABASE_ERROR',
        });
        const currentPosition = await postgresQueryExec.getUserCurrentPosition('TEST13', postgresDataSetup.registeredUsers[0].id);
        expect(currentPosition).toHaveLength(0);
        done();
      })
      .catch((error) => done(error));
  });
});
