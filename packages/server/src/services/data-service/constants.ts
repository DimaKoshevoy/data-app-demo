export const QUOTE_CURRENCY = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; // ETH
export const EXCHANGE = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"; //factory
export const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
export const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
export const INIT_CODE_HASH =
  "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f";

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

export enum TIME_INTERVALS {
  WEEK_1 = "WEEK_1",
  HOUR_4 = "HOUR_4",
  DAY_1 = "DAY_1",
  HOUR_1 = "HOUR_1",
  MINUTE_15 = "MINUTE_15",
}

type TimeIntervalsItem = {
  id: string;
  value: number;
  caption: string;
};

export const TIME_INTERVALS_DATA: Record<TIME_INTERVALS, TimeIntervalsItem> = {
  [TIME_INTERVALS.WEEK_1]: {
    id: TIME_INTERVALS.WEEK_1,
    value: ONE_DAY * 7,
    caption: "7d",
  },
  [TIME_INTERVALS.DAY_1]: {
    id: TIME_INTERVALS.DAY_1,
    value: ONE_DAY,
    caption: "1d",
  },
  [TIME_INTERVALS.HOUR_4]: {
    id: TIME_INTERVALS.HOUR_4,
    value: ONE_HOUR * 4,
    caption: "4h",
  },
  [TIME_INTERVALS.HOUR_1]: {
    id: TIME_INTERVALS.HOUR_1,
    value: ONE_HOUR,
    caption: "1h",
  },
  [TIME_INTERVALS.MINUTE_15]: {
    id: TIME_INTERVALS.MINUTE_15,
    value: ONE_MINUTE * 10,
    caption: "15m",
  },
};

export const DEFAULT_TIMESTAMP = 4102488000;
export const BROKEN_NAME = "Error in name";
export const BROKEN_ADDRESS = "-";
