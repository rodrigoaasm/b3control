// eslint-disable-next-line import/no-extraneous-dependencies
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import { createApp } from './application/app';

dotenv.config();

import('./application/config/orm').then(async (config: any) => {
  const port = process.env.API_PORT;

  const connection = await createConnection(config.default);
  const app = await createApp(connection);
  await app.api.listen(port);

  console.log(`API B3 Control\n http://localhost:${port}`);
});
