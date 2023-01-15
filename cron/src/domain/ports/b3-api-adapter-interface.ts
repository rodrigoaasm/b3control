export interface IB3ApiAssetQuoteData {
  code: string,
  value: number,
}

export interface IB3ApiAdapter {
  getQuote(code: string): Promise<IB3ApiAssetQuoteData>;
}
