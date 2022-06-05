export interface IReportInput {
  userId: string,
}

export interface IReportOutput {

}

export interface IReportUseCase< I extends IReportInput, O extends IReportOutput>{
  get (filters : I): Promise<O>;
}
