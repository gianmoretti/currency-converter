import { injectable } from "@msiviero/knit";
import { ConfigProvider } from "./config";
import { DailyConfigs, Rates } from "../configType";
import * as moment from "moment";

const KEY_DATE_FORMAT = "YYYY-MM-DD";

@injectable()
export class ExchangeRateService {
  private readonly config: Promise<DailyConfigs>;

  constructor(private readonly configProvider: ConfigProvider) {
    this.config = this.configProvider.getOnlineConfig();
  }

  public async getRate(
    currency: string,
    refDate: Date
  ): Promise<number | undefined> {
    if (currency === "EUR") return 1;

    const strRefDate = moment(refDate).format(KEY_DATE_FORMAT);
    const dailyConfigRef: Rates | undefined = (await this.config).rates[
      strRefDate
    ];
    if (!dailyConfigRef) return undefined;
    const rateConfigRef: number | undefined = dailyConfigRef![currency];
    if (!rateConfigRef) return undefined;
    return rateConfigRef;
  }
}
