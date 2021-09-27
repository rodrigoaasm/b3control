import * as express from 'express';
import { ExpressRouterAdapter } from '@external/adapters/express-router-adapter';

export default async (app : express.Express, dependencies) => {
  app.get('/', (req, res) => res.status(200).json({ ok: true }));
  app.post('/operation/submit', await ExpressRouterAdapter.routerAdapter(dependencies.operationController.submit));
};
