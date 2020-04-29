import { injectable } from "@msiviero/knit";
import { ExchangeRateService } from "./rate";

@injectable()
export class CalculatorService {
  constructor(private readonly rateService: ExchangeRateService) {}

  public calculate(
    amount: number,
    srcCurrency: string,
    destCurrency: string,
    referenceDate: Date
  ): number | undefined {
    const srcCurrencyRate: number | undefined = this.rateService.getRate(
      srcCurrency,
      referenceDate
    );
    const destCurrencyRate: number | undefined = this.rateService.getRate(
      destCurrency,
      referenceDate
    );
    if (!srcCurrency || !destCurrency) return undefined;
    return (amount * destCurrencyRate!) / srcCurrencyRate!;
  }
}
