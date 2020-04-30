export interface DailyConfigs {
  rates: DateRates;
}

export interface DateRates {
  [date: string]: Rates;
}

export interface Rates {
  [currency: string]: number;
}
