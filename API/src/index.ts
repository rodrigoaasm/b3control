import config from 'src/application/config/orm';
import { createApp } from './application/app';

createApp(config).then(() => {
  console.log('B3 Control');
});
