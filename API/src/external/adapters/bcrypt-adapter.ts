import * as bcrypt from 'bcrypt';

import { ICryptHandlerAdapter } from '@domain-ports/adapters/crypt-handler-adapter-interface';

export class CryptAdapter implements ICryptHandlerAdapter {
  // eslint-disable-next-line class-methods-use-this
  async compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }

  // eslint-disable-next-line class-methods-use-this
  async generateHash(payload: string, round: number = 10): Promise<string> {
    const hash = await bcrypt.hash(payload, round);
    return hash;
  }
}

export default CryptAdapter;
