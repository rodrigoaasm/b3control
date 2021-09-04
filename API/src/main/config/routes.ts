import * as express from 'express';

export default async (app : express.Express) => {
  app.get('/', (req, res) => res.status(200).json({ ok: true }));
};
