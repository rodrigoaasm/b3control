/* eslint-disable no-underscore-dangle */
import AssetRepositoryMock from '@test-mocks/asset-repository-mock';
import AssetsListingUsecase from '@usecases/assets-listing/assets-listing-usecase';

describe('Submit Dividend Payment Use Case', () => {
  let assetsListingUseCase : AssetsListingUsecase;

  beforeEach(() => {
    assetsListingUseCase = new AssetsListingUsecase(new AssetRepositoryMock());
  });

  it('Should return all assets', async () => {
    const output = await assetsListingUseCase.list();
    expect(output.length).toEqual(2);
    expect(output[0]._code).toEqual('TEST11');
    expect(output[1]._code).toEqual('TEST4');
  });
});
