import { Service } from '@angular/core';
import { IsoDate, IsoDateTime } from '../models/dates';
import { toIsoDate } from '../domain/dates';

/** Single source of "now" so dates stay deterministic in tests. */
@Service()
export class Clock {
  public today(): IsoDate {
    return toIsoDate(new Date());
  }

  public now(): IsoDateTime {
    return new Date().toISOString() as IsoDateTime;
  }
}
