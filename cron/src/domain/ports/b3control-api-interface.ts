export interface IB3ControlAssetQuote {
  code: string,
  value: number,
  date: Date,
}

export interface IAsset {
  code: string,
  social: string,
}

export interface IB3ControlApiAdapter {
  getAllAssets(): Promise<Array<IAsset>>
  saveQuotes(assetQuotes: IB3ControlAssetQuote[]): Promise<void>
}
