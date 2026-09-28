/** Calendar date without time or timezone, formatted as `YYYY-MM-DD`. */
export type IsoDate = string & { readonly __brand: 'IsoDate' };

/** Instant in time, formatted as a full ISO 8601 string. */
export type IsoDateTime = string & { readonly __brand: 'IsoDateTime' };

export interface DateRange {
  readonly from: IsoDate;
  readonly to: IsoDate;
}
