export interface IJWTHandlerAdapter {
  generateToken(bodyObject: any, expiresIn: number) : string;
  verifyAndDecodeToken (token: string): any;
}
