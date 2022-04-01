export interface ICryptHandlerAdapter {
  generateHash(payload: string, round?: number): Promise<string>;
  compare(data: string, hash: string): Promise<boolean>;
}
