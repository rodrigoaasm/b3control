class CustomError extends Error {
  constructor(public status: string, message: string) {
    super(message);
  }
}

export const ConstructorEntityError = (message: string) => new CustomError('CONSTRUCTOR_ENTITY_ERROR', message);
export const NotFoundError = (message: string) => new CustomError('NOT_FOUND_ERROR', message);
export const BadRequestError = (message: string) => new CustomError('BAD_REQUEST_ERROR', message);

export default CustomError;
