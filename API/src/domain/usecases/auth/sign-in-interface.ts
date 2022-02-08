export interface ISignInOutput {
  _token: string;
  _authenticatedUser: {
    _id: string,
    _username: string,
  }
}

export interface ISignInUseCase {
  signIn(username: String, password: string): Promise<ISignInOutput>
}
