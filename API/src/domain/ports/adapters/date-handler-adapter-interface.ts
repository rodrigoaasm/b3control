export type DateDifferenceCategory =
  'Milliseconds' |
  'Seconds' |
  'Minutes' |
  'Hours' |
  'Days' |
  'Weeks' |
  'Months' |
  'Years';

export interface IDateHandlerAdapter {
  parse(dateString: string, format: string): Date;
  format(date: Date, format: string): string;
  dateDiff(category: DateDifferenceCategory, dateLeft: Date, dateRight: Date): number;
}
