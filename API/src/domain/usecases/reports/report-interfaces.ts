export interface IReportInput {
  userId: string,
  codes : Array<string>,
  begin ?: Date,
  end ?: Date
}

export interface IReportOutput {

}

export interface IReportUseCase< I extends IReportInput, O extends IReportOutput>{
  get (filters : I): Promise<O>;
}
