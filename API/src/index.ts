import { createConnection } from 'typeorm';

import config from '@config/orm';
import { createApp } from './main/app';

createConnection(config).then(async () => {
  const app = await createApp();

  app.listen(4000, () => {
    console.log('B3Control');
  });
});
