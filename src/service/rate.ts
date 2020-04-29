import { injectable } from "@msiviero/knit";
import { ConfigProvider } from "./config";
import { DailyConfigs, RateConfig, DailyConfig } from "../configType";

@injectable()
export class ExchangeRateService {
  private readonly config: DailyConfigs;

  constructor(private readonly configProvider: ConfigProvider) {
    this.config = this.configProvider.loadConfig();
  }

  public getRate(currency: string, refDate: Date): number | undefined {
    if (currency === "EUR") return 1;

    const dailyConfigRef:
      | DailyConfig
      | undefined = this.config.dailyConfigs.find(
      (dailyConfig) => dailyConfig.time.getTime() === refDate.getTime()
    );
    if (!dailyConfigRef) return undefined;
    const rateConfigRef: RateConfig | undefined = dailyConfigRef!.rates.find(
      (rateConfig) => rateConfig.currency === currency
    );
    if (!rateConfigRef) return undefined;
    return rateConfigRef.rate;
  }
}
