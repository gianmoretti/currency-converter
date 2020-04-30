import { injectable } from "@msiviero/knit";
import { DailyConfigs } from "../configType";
import { Client } from "../client/http";
import { logger } from "../logger";
import * as moment from "moment";

const PARAMS_DATE_FORMAT = "YYYY-MM-DD";
const BACKWARD_MONTHS = parseInt(process.env.BACKWARD_MONTHS || "4", 10);
const EXCHANGE_RATE_ENDPOINT_BASE_URL =
  "https://api.exchangeratesapi.io/history";

@injectable()
export class ConfigProvider {
  constructor(private readonly client: Client) {}

  public async getOnlineConfig(): Promise<DailyConfigs> {
    const now = moment();
    const endAt = now.format(PARAMS_DATE_FORMAT);
    const startAt = now
      .subtract(BACKWARD_MONTHS, "months")
      .format(PARAMS_DATE_FORMAT);
    const response = await this.client.get(
      `${EXCHANGE_RATE_ENDPOINT_BASE_URL}?start_at=${startAt}&end_at=${endAt}`,
      "application/json"
    );
    const dailyConfigs: DailyConfigs = response.body as DailyConfigs;
    logger.debug(
      `Config between ${startAt} and ${endAt}: ${JSON.stringify(dailyConfigs)}`
    );
    return dailyConfigs;
  }
}
