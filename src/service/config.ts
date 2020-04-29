import { injectable } from "@msiviero/knit";
import { DailyConfigs } from "../configType";

@injectable()
export class ConfigProvider {
  public loadConfig(): DailyConfigs {
    return {
      dailyConfigs: [
        {
          time: new Date("2020/04/30"),
          rates: [
            {
              currency: "USD",
              rate: 1.12345,
            },
            {
              currency: "AUD",
              rate: 5.4321,
            },
          ],
        },
        {
          time: new Date("2020/04/29"),
          rates: [
            {
              currency: "USD",
              rate: 1.2345,
            },
            {
              currency: "AUD",
              rate: 6.5432,
            },
          ],
        },
      ],
    };
  }
}
