import React, { useEffect, useState } from 'react';
import Chart from 'kaktana-react-lightweight-charts';
import { useParams } from 'react-router-dom';
import { useTheme, THEMES } from '../theme/useTheme';
import { LoadingOverlay } from '../components/loader/loading-overlay';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getChartData, cleanChartData } from './reducer';
import {
  CANDLE_OPTIONS,
  DARK_THEME,
  DEFAULT_OPTIONS,
  HISTO_OPTIONS,
  LIGHT_THEME,
} from './constants';

export const SingleToken = () => {
  const dispatch = useAppDispatch();
  const { address } = useParams<{ address: string }>();
  const chartData = useAppSelector(
    ({ singleTokenSlice: { chartData } }) => chartData
  );
  const { theme } = useTheme();

  const [candlestickSeries, setCandlestickSeries] = useState<any>();
  const [histogramSeries, setHistogramSeries] = useState<any>();
  const [from, setFrom] = useState<any>();
  const [to, setTo] = useState<any>();

  useEffect(() => {
    if (chartData?.length) {
      setCandlestickSeries([
        { data: chartData, legend: 'Price', options: CANDLE_OPTIONS },
      ]);
      setHistogramSeries([
        { data: chartData, legend: 'Volume', options: HISTO_OPTIONS },
      ]);
      setFrom(chartData[0].time);
      setTo(chartData[chartData.length - 1].time);
    }
  }, [chartData]);

  useEffect(() => {
    dispatch(getChartData(address));

    return () => {
      dispatch(cleanChartData());
    };
  }, [dispatch, address]);

  return candlestickSeries ? (
    <div className="w-full h-full">
      <Chart
        options={{
          ...DEFAULT_OPTIONS,
          ...(theme === THEMES.DARK ? DARK_THEME : LIGHT_THEME),
        }}
        from={from}
        to={to}
        candlestickSeries={candlestickSeries}
        histogramSeries={histogramSeries}
        autoWidth
        autoHeight
        {...(theme === THEMES.DARK && { darkTheme: true })}
      />
    </div>
  ) : (
    <LoadingOverlay />
  );
};
