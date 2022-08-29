import { IApplicationRequest, IApplicationResponse } from '@application/types';
import { IAssetsListingUsecase } from '@usecases/assets-listing/assets-listing-interface';

export class AssetsListingController {
  constructor(
    private assetsListingUsecase: IAssetsListingUsecase,
  ) {

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getList = async (req : IApplicationRequest) : Promise<IApplicationResponse> => {
    const result = await this.assetsListingUsecase.list();
    return {
      code: 200,
      body: result,
    };
  };
}

export default AssetsListingController;
