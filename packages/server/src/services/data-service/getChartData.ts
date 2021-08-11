import { getPriceInUSD } from "./utils";

export const getChartData = (queryData: any) => {
  const chartData = queryData.data.CHART_DATA.dexTrades;
  const usdData = queryData.data.USD_DATA.dexTrades;
  const usdDataByInterval = usdData.reduce((acc: any, intervalData: any) => {
    const {
      timeInterval: { hour },
    } = intervalData;
    return { ...acc, [hour]: intervalData };
  }, {});

  const transformedData = chartData.map((intervalData: any) => {
    const {
      tradeAmount,
      trades,
      open,
      high,
      low,
      close,
      timeInterval: { hour },
    } = intervalData;
    const usdIntervalData = usdDataByInterval[hour];

    return {
      open: getPriceInUSD(Number(usdIntervalData.open), Number(open)),
      high: getPriceInUSD(usdIntervalData.high, high),
      low: getPriceInUSD(usdIntervalData.low, low),
      close: getPriceInUSD(Number(usdIntervalData.close), Number(close)),
      time: Date.parse(hour) / 1000,
      value: tradeAmount,
      trades,
    };
  });

  return transformedData;
};
