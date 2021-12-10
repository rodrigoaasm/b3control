export interface IDateHandlerAdapter {
  parse(dateString: string, format: string): Date;
}
