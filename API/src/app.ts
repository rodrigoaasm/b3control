import 'reflect-metadata';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

export class App {
  public express: express.Application;

  public constructor(aExpress: express.Application) {
    this.express = aExpress;
    this.middlewares();
  }

  private middlewares(): void {
    this.express.use(cors());
    this.express.use(bodyParser.json());
  }
}

export default App;
