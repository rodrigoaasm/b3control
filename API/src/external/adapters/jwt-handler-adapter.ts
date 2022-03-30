import { IJWTHandlerAdapter } from '@domain-ports/adapters/jwt-handler-adapter-interface';
import * as jwt from 'jsonwebtoken';

export class JWTHandlerAdapter implements IJWTHandlerAdapter {
  constructor(private jwtSecret: string = process.env.JWT_SECRET) {
  }

  // eslint-disable-next-line class-methods-use-this
  generateToken(bodyObject: any, expiresIn: number = 2592000): string {
    const token = jwt.sign(bodyObject, this.jwtSecret, { expiresIn });

    return token;
  }

  // eslint-disable-next-line class-methods-use-this
  verifyAndDecodeToken(token: string) {
    const decodedToken: any = jwt.verify(token, this.jwtSecret);

    if (!decodedToken.id) { throw new Error('Token is invalid'); }
    return decodedToken;
  }
}

export default JWTHandlerAdapter;
