import { IReportInput } from './report-interfaces';

export interface IReportInputHandler {
  handle(params: any): IReportInput;
}
