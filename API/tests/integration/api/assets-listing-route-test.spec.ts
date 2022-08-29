import * as request from 'supertest';

import { IApp, createApp } from '@application/app';
import { PostgresDataSetup } from '@test-setup/postgres-data-setup';

describe('GET /assets', () => {
  let app: IApp;
  let postgresDataSetup: PostgresDataSetup;

  beforeAll(async () => {
    // prepare postgres
    postgresDataSetup = new PostgresDataSetup();
    await postgresDataSetup.init();
    await postgresDataSetup.up();

    // create app
    app = await createApp(postgresDataSetup.getConnection());
  });

  afterAll(async () => {
    await postgresDataSetup.down();
    await postgresDataSetup.getConnection().close();
    app = null;
  });

  it('Should get all assets', (done) => {
    request(app.api)
      .get('/assets')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).toEqual([
          {
            _code: 'TEST11',
            _social: 'Teste',
            _logo: '',
            _category: 'general',
            _id: expect.any(Number),
          },
          {
            _code: 'TEST4',
            _social: 'Teste',
            _logo: '',
            _category: 'stock',
            _id: expect.any(Number),
          },
          {
            _code: 'TEST3',
            _social: 'Teste',
            _logo: '',
            _category: 'stock',
            _id: expect.any(Number),
          },
        ]);
        done();
      })
      .catch(done);
  });
});
