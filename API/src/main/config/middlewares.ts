import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

export default (app : express.Express) => {
  app.use(bodyParser.json());
  app.use(cors());
};
