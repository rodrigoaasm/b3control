import { IB3ApiAdapter, IB3ApiAssetQuoteData } from '../ports/b3-api-adapter-interface';
import { IAsset, IB3ControlApiAdapter, IB3ControlAssetQuote } from '../ports/b3control-api-interface';
import { ISyncAssetsService } from './sync-assets-interface';

export class SyncAssetsService implements ISyncAssetsService {
  constructor(
    private b3ApiAdapter: IB3ApiAdapter,
    private b3ControlApiAdapter: IB3ControlApiAdapter,
  ) {

  }

  // eslint-disable-next-line class-methods-use-this
  private doRequestQuotes(
    resolve: Function,
    reject: Function,
    assetList: IAsset[],
    assetQuoteList: IB3ControlAssetQuote[] = [],
    numberError: number = 0,
  ) {
    const outerThis = this;
    const currentAsset = assetList.shift();
    this.b3ApiAdapter.getQuote(currentAsset.code)
      .then((assetQuote: IB3ApiAssetQuoteData) => {
        assetQuoteList.push({
          ...assetQuote,
          date: null,
        });

        if (assetList.length > 0) {
          setTimeout(
            () => outerThis.doRequestQuotes(resolve, reject, assetList, assetQuoteList),
            15000,
          );
        } else {
          resolve(assetQuoteList);
        }
      })
      .catch(() => {
        assetList.unshift(currentAsset);
        if (numberError < 3) {
          setTimeout(
            () => outerThis
              .doRequestQuotes(resolve, reject, assetList, assetQuoteList, numberError + 1),
            15000,
          );
        } else {
          reject(new Error('Unable to fetch all quotes'));
        }
      });
  }

  private requestQuotes(assets: IAsset[]): Promise<Array<IB3ControlAssetQuote>> {
    const outerThis = this;
    return new Promise(
      (resolve: Function, reject: Function) => {
        outerThis.doRequestQuotes(resolve, reject, assets);
      },
    );
  }

  public async sync(): Promise<void> {
    const assets = await this.b3ControlApiAdapter.getAllAssets();
    const assetsQuote = await this.requestQuotes(assets);
    await this.b3ControlApiAdapter.saveQuotes(assetsQuote);
  }
}

export default SyncAssetsService;
