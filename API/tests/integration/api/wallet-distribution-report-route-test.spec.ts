import * as request from 'supertest';

import { IApp, createApp } from '@application/app';
import { PostgresDataSetup } from '@test-setup/postgres-data-setup';
import { JWTHandlerAdapter } from '@external/adapters/jwt-handler-adapter';

describe('GET /report/walletstatus', () => {
  let app: IApp;
  let postgresDataSetup: PostgresDataSetup;
  let accessTokens: Array<string>;

  beforeAll(async () => {
    // prepare postgres
    postgresDataSetup = new PostgresDataSetup();
    await postgresDataSetup.init();
    await postgresDataSetup.up();

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

  it('Should get wallet sucessfully', (done) => {
    request(app.api)
      .get('/report/walletstatus')
      .set('Authorization', `Bearer ${accessTokens[0]}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).toEqual({
          assets: [
            {
              _asset: {
                _category: 'general',
                _code: 'TEST11',
                _id: expect.any(Number),
                _logo: '',
                _social: 'Teste',
              },
              _date: expect.any(String),
              _price: 15,
              _quantity: 0,
              _value: 0,
            },
            {
              _asset: {
                _category: 'stock',
                _code: 'TEST4',
                _id: expect.any(Number),
                _logo: '',
                _social: 'Teste',
              },
              _date: expect.any(String),
              _price: 12,
              _quantity: 60,
              _value: 720,
            },
            {
              _asset: {
                _category: 'stock',
                _code: 'TEST3',
                _id: expect.any(Number),
                _logo: '',
                _social: 'Teste',
              },
              _date: expect.any(String),
              _price: 8,
              _quantity: 40,
              _value: 320,
            },
          ],
          categories: [
            {
              _category: 'general',
              _date: expect.any(String),
              _value: 0,
            },
            {
              _category: 'stock',
              _date: expect.any(String),
              _value: 1040,
            },
          ],
        });
        done();
      })
      .catch(done);
  });
});
