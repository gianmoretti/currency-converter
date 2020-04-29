export interface DailyConfigs {
  dailyConfigs: DailyConfig[];
}

export interface DailyConfig {
  time: Date;
  rates: RateConfig[];
}

export interface RateConfig {
  currency: string;
  rate: number;
}
