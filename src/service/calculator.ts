import { injectable } from "@msiviero/knit";
import { ExchangeRateService } from "./rate";

const DECIMAL_APPROXIMATION = parseInt(
  process.env.DECIMAL_APPROXIMATION || "10000",
  10
);

@injectable()
export class CalculatorService {
  constructor(private readonly rateService: ExchangeRateService) {}

  public async calculate(
    amount: number,
    srcCurrency: string,
    destCurrency: string,
    referenceDate: Date
  ): Promise<number | undefined> {
    const srcCurrencyRate: number | undefined = await this.rateService.getRate(
      srcCurrency,
      referenceDate
    );
    const destCurrencyRate: number | undefined = await this.rateService.getRate(
      destCurrency,
      referenceDate
    );
    if (!srcCurrencyRate || !destCurrencyRate) return undefined;
    return this.decimalApproximate(
      (amount * destCurrencyRate!) / srcCurrencyRate!
    );
  }

  private decimalApproximate(amount: number): number {
    return (
      Math.round((amount + Number.EPSILON) * DECIMAL_APPROXIMATION) /
      DECIMAL_APPROXIMATION
    );
  }
}
