import { IAplicationRequest, IAplicationResponse } from 'src/application/types';
import { ISubmitOperationUseCase, ISubmitOperationInput } from '@usecases/submit-operation/submit-operation-interfaces';

export class OperationController {
  constructor(
    private submitOperationUseCase : ISubmitOperationUseCase,
  ) {

  }

  public submit = async (req : IAplicationRequest) : Promise<IAplicationResponse> => {
    const submitedOperation = await this.submitOperationUseCase.submit(
      req.body as ISubmitOperationInput,
    );

    return {
      code: 201,
      body: submitedOperation,
    };
  };
}

export default OperationController;
