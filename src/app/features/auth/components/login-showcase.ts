import { Component } from '@angular/core';
import { MoneyPipe } from '../../../core/format/money.pipe';
import type { CurrencyCode } from '../../../core/models/money';
import { DEFAULT_CURRENCY } from '../../../core/models/money';
import { Monogram } from '../../../shared/ui/monogram/monogram';

/** Brand panel of the login: a glimpse of the app (month total, budget and upcoming charges). */
@Component({
  selector: 'app-login-showcase',
  imports: [MoneyPipe, Monogram],
  template: `
    <div class="glow" aria-hidden="true"></div>
    <p class="brand">
      <span class="mark" aria-hidden="true">C</span>
      CashCompanion
    </p>

    <div class="stage" aria-hidden="true">
      <div class="ticket">
        <span class="ticket-label">Este mes</span>
        <span class="ticket-amount tabular">{{ spent | money: currency }}</span>
        <span class="bar"><span class="fill"></span></span>
        <span class="ticket-foot tabular">68 % de {{ budget | money: currency : true }}</span>
      </div>
      <div class="chip chip-a">
        <app-monogram icon="film" color="pink" [size]="34" />
        <span class="chip-text">
          <strong>Streaming</strong>
          <span>en 3 días · {{ 1299 | money: currency }}</span>
        </span>
      </div>
      <div class="chip chip-b">
        <app-monogram icon="heart" color="mint" [size]="34" />
        <span class="chip-text">
          <strong>Gimnasio</strong>
          <span>renovado · {{ 3490 | money: currency }}</span>
        </span>
      </div>
    </div>

    <p class="tagline">Tu dinero,<br /><em>sin sorpresas.</em></p>
    <p class="pitch">Gastos y suscripciones en un solo vistazo, antes de que lleguen.</p>
  `,
  styleUrl: './login-showcase.css',
})
export class LoginShowcase {
  protected readonly currency: CurrencyCode = DEFAULT_CURRENCY;
  protected readonly spent: number = 128450;
  protected readonly budget: number = 190000;
}
