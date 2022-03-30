import { IApplicationRequest, IApplicationResponse } from 'src/application/types';
import { ISubmitDividendPaymentUseCase } from '@usecases/submit-dividend/submit-dividend-payments-interfaces';

export class DividendPaymentController {
  constructor(
    private submitDividendPaymentUseCase : ISubmitDividendPaymentUseCase,
  ) {

  }

  public submit = async (req : IApplicationRequest) : Promise<IApplicationResponse> => {
    const submitedOperation = await this.submitDividendPaymentUseCase.submit({
      userId: req.headers.owner,
      assetCode: req.body.assetCode,
      createdAt: req.body.createdAt,
      value: req.body.value,
    });

    return {
      code: 201,
      body: {
        ...submitedOperation,
        _user: undefined,
      },
    };
  };
}

export default DividendPaymentController;
