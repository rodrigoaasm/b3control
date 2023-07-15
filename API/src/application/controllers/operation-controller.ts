import { IApplicationRequest, IApplicationResponse } from '@application/types';
import { ISubmitOperationUseCase, ISubmitOperationInput } from '@usecases/submit-operation/submit-operation-interfaces';

export class OperationController {
  constructor(
    private submitOperationUseCase : ISubmitOperationUseCase,
  ) {

  }

  public submit = async (req : IApplicationRequest) : Promise<IApplicationResponse> => {
    const submitedOperation = await this.submitOperationUseCase.submit({
      userId: req.headers.owner,
      assetCode: req.body.assetCode,
      type: req.body.type,
      value: req.body.value,
      quantity: req.body.quantity,
      createdAt: req.body.createdAt,
    } as ISubmitOperationInput);

    return {
      code: 201,
      body: {
        ...submitedOperation,
        _user: undefined,
      },
    };
  };
}

export default OperationController;
