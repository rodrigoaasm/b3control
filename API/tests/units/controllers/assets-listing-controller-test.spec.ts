/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IApplicationRequest } from '@application/types';
import AssetsListingController from '@controllers/assets-listing-controller';
import { IAssetsListingOutput, IAssetsListingUsecase, IAssetsListingItem } from '@usecases/assets-listing/assets-listing-interface';

const output = [
  {
    _code: 'TEST11',
    _category: 'stock',
    _id: 1,
    _logo: '',
    _social: 'test',
  } as IAssetsListingItem,
  {
    _code: 'TEST4',
    _category: 'stock',
    _id: 2,
    _logo: '',
    _social: 'test',
  } as IAssetsListingItem,
];

class MockAssetsListingUsecase implements IAssetsListingUsecase {
  list(): Promise<IAssetsListingOutput> {
    return Promise.resolve(output);
  }
}

describe('Assets Listing Controller', () => {
  let mockAssetsListing: MockAssetsListingUsecase;
  let assetsListingController: AssetsListingController;

  beforeEach(() => {
    mockAssetsListing = new MockAssetsListingUsecase();
    assetsListingController = new AssetsListingController(mockAssetsListing);
  });

  it('Should run successfully', async () => {
    const request: IApplicationRequest = {
      body: {},
      headers: {},
      params: {},
    };
    const response = await assetsListingController.getList(request);

    expect(response.code).toEqual(200);
    expect(response.body).toEqual(output);
  });
});
