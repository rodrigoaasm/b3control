import { IApplicationRequest, IApplicationResponse } from 'src/application/types';
import { ISubmitDividendPaymentUseCase, ISubmitDividendPaymentInput } from '@usecases/submit-dividend/submit-dividend-payments-interfaces';

export class DividendPaymentController {
  constructor(
    private submitDividendPaymentUseCase : ISubmitDividendPaymentUseCase,
  ) {

  }

  public submit = async (req : IApplicationRequest) : Promise<IApplicationResponse> => {
    const submitedOperation = await this.submitDividendPaymentUseCase.submit(
      req.body as ISubmitDividendPaymentInput,
    );

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
