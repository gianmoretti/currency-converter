import { api, Exchange, HttpMethod, route } from "@msiviero/knit";
import { CalculatorService } from "../service/calculator";

interface ConvertRequest {
  readonly amount: string;
  readonly src_currency: string;
  readonly dest_currency: string;
  readonly reference_date: string;
}

@api()
export class Converter {
  constructor(private readonly service: CalculatorService) {}

  @route(HttpMethod.GET, "/convert")
  public async getEndpoint(exchange: Exchange) {
    const {
      amount,
      src_currency,
      dest_currency,
      reference_date,
    }: ConvertRequest = exchange.request.query as ConvertRequest;

    if (!src_currency) {
      exchange.response.status(400).send({
        message: "src_currency not present",
      });
      return;
    }

    if (!dest_currency) {
      exchange.response.status(400).send({
        message: "dest_currency not present",
      });
      return;
    }

    const parsedAmountFloat: number | undefined = parseFloat(amount);
    if (!parsedAmountFloat) {
      exchange.response.status(400).send({
        message: "amount not valid",
      });
      return;
    }

    const parsedReferenceDate: Date | undefined = new Date(reference_date);
    if (!parsedReferenceDate.valueOf()) {
      exchange.response.status(400).send({
        message: "reference_date not valid",
      });
      return;
    }

    exchange.response.status(200).send({
      amount: this.service.calculate(
        parsedAmountFloat,
        src_currency!,
        dest_currency!,
        parsedReferenceDate
      ),
      currency: dest_currency,
    });
  }
}
