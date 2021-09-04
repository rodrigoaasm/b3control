import * as express from 'express';
import * as dotenv from 'dotenv';
import { App } from './app';

dotenv.config();
const app = new App(express());

app.express.listen(4000, () => {
  console.log('B3Control');
});
