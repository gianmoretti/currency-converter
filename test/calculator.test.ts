import { CalculatorService } from "../src/service/calculator";
import { ExchangeRateService } from "../src/service/rate";
import { Mock, Times, It } from "typemoq";

describe("Calculator instance", () => {
  const exchangeRateServiceMock = Mock.ofType<ExchangeRateService>();
  let sut = new CalculatorService(exchangeRateServiceMock.object);

  beforeEach(() => {
    exchangeRateServiceMock.reset();
    sut = new CalculatorService(exchangeRateServiceMock.object);
  });

  it("should calculate the exchange rate", async () => {
    exchangeRateServiceMock
      .setup((rateService) =>
        rateService.getRate(It.isValue("EUR"), It.isAny())
      )
      .returns(() => 1);

    exchangeRateServiceMock
      .setup((rateService) => rateService.getRate("USD", It.isAny()))
      .returns(() => 1.0852);

    const amount: number = 1;
    const srcCurrency: string = "EUR";
    const destCurrency: string = "USD";
    const refDate: Date = new Date("2020/04/28");

    const actual = sut.calculate(amount, srcCurrency, destCurrency, refDate);
    expect(actual).toEqual(1.0852);

    exchangeRateServiceMock.verify(
      (rateService) => rateService.getRate("EUR", refDate),
      Times.once()
    );

    exchangeRateServiceMock.verify(
      (rateService) => rateService.getRate("USD", refDate),
      Times.once()
    );
  });
});