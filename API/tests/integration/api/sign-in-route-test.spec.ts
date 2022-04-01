/* eslint-disable no-underscore-dangle */
import * as request from 'supertest';

import { IApp, createApp } from '@application/app';
import { PostgresDataSetup } from '@test-setup/postgres-data-setup';

describe('POST /signin', () => {
  let app: IApp;
  let postgresDataSetup: PostgresDataSetup;

  const requestBody = {
    username: 'user1',
    password: 'test123*',
  };

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

  it('Should sign-in sucessfully', (done) => {
    request(app.api)
      .post('/signin')
      .send({
        ...requestBody,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body._authenticatedUser).toEqual({
          _id: postgresDataSetup.registeredUsers[0].id,
          _username: postgresDataSetup.registeredUsers[0].name,
        });
        expect(response.body._token).toBeDefined();
        done();
      })
      .catch((signInError) => {
        done(signInError);
      });
  });

  it('Should sign-in fail when the user is not found', (done) => {
    request(app.api)
      .post('/signin')
      .send({
        ...requestBody,
        username: 'user3',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .then((response) => {
        expect(response.body.message).toEqual('Username and password don\'t match a user!');
        expect(response.body.status).toEqual('UNAUTHORIZED_ERROR');
        done();
      })
      .catch((signInError) => {
        done(signInError);
      });
  });

  it('Should return a badrequest response when the username is not informed', (done) => {
    request(app.api)
      .post('/signin')
      .send({
        password: 'password',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The username (min: 5 ch.) or/and password (min: 8 ch.) is invalid.');
        expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
        done();
      })
      .catch((signInError) => {
        done(signInError);
      });
  });

  it('Should return a badrequest response when username is less than 5 characters', (done) => {
    request(app.api)
      .post('/signin')
      .send({
        username: 'user',
        password: 'password',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The username (min: 5 ch.) or/and password (min: 8 ch.) is invalid.');
        expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
        done();
      })
      .catch((signInError) => {
        done(signInError);
      });
  });

  it('Should return a badrequest response when the password is not informed', (done) => {
    request(app.api)
      .post('/signin')
      .send({
        username: 'user1',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The username (min: 5 ch.) or/and password (min: 8 ch.) is invalid.');
        expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
        done();
      })
      .catch((signInError) => {
        done(signInError);
      });
  });

  it('Should return a badrequest response when password is less than 8 characters', (done) => {
    request(app.api)
      .post('/signin')
      .send({
        username: 'user',
        password: '1234567',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('The username (min: 5 ch.) or/and password (min: 8 ch.) is invalid.');
        expect(response.body.status).toEqual('BAD_REQUEST_ERROR');
        done();
      })
      .catch((signInError) => {
        done(signInError);
      });
  });
});
