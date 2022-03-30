import * as request from 'supertest';

import { IApp, createApp } from '@application/app';
import { PostgresDataSetup } from '@test-setup/postgres-data-setup';

const protectedRoutes = [
  { method: 'post', path: '/operation' },
  { method: 'post', path: '/dividendpayment' },
  { method: 'get', path: '/report/assettimeseries/codes/begin/end' },
  { method: 'get', path: '/report/dividendpayments/codes/begin/end' },
];

const accessTokenTest = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0NGdoLTRnMTFoLWdnMmgyLTEyZzJoMi0xZzFoZyJ9.G9t_chIvZaGslcm4tDXjRlE3LKhjS-VeoAeyUbnAais';

describe('Protected Routes test', () => {
  let app: IApp;
  let postgresDataSetup: PostgresDataSetup;

  beforeAll(async () => {
    postgresDataSetup = new PostgresDataSetup();
    await postgresDataSetup.init();
    app = await createApp(postgresDataSetup.getConnection());
  });

  afterAll(async () => {
    await postgresDataSetup.down();
    await postgresDataSetup.getConnection().close();
    app = null;
  });

  protectedRoutes.forEach((route) => {
    describe(`${route.path}`, () => {
      it('Should not allow the submit when the access token was not entered', (done) => {
        request(app.api)[route.method](route.path)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401)
          .then((response) => {
            expect(response.body.message).toEqual('The token was not informed!');
            expect(response.body.status).toEqual('UNAUTHORIZED_ERROR');
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('Should not allow the submit when the authorization header format was invalid', (done) => {
        request(app.api)[route.method](route.path)
          .set('Authorization', accessTokenTest)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401)
          .then((response) => {
            expect(response.body.message).toEqual('The authorization header format is invalid!');
            expect(response.body.status).toEqual('UNAUTHORIZED_ERROR');
            done();
          })
          .catch((error) => {
            done(error);
          });
      });

      it('Should not allow the submit when the access token was invalid', (done) => {
        request(app.api)[route.method](route.path)
          .set('Authorization', `Bearer ${accessTokenTest}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401)
          .then((response) => {
            expect(response.body.status).toEqual('UNAUTHORIZED_ERROR');
            done();
          })
          .catch((error) => {
            done(error);
          });
      });
    });
  });
});
