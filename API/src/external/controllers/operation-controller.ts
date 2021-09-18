import { IAplicationRequest, IAplicationResponse } from '@external/types/';
import { ISubmitOperationUseCase, ISubmitOperationInput } from '@usecases/submit-operation/submit-operation-interfaces';

export class OperationController {
  constructor(
    private submitOperationUseCase : ISubmitOperationUseCase,
  ) {

  }

  public submit = async (req : IAplicationRequest) : Promise<IAplicationResponse> => {
    try {
      const submitedOperation = await this.submitOperationUseCase.submit(
        req.body as ISubmitOperationInput,
      );
      return {
        code: 201,
        body: submitedOperation,
      };
    } catch (err) {
      return {
        code: 500,
        body: { error: err.message },
      };
    }
  };
}

export default OperationController;
