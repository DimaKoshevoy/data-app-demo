import React, {useEffect, useState} from 'react';
import Chart from 'kaktana-react-lightweight-charts'
import {CrosshairMode} from 'lightweight-charts';
import {useParams} from "react-router-dom";
import {formatPrice} from '../utils';
import {useTheme, THEMES} from '../theme/useTheme';
import {LoadingOverlay} from '../components/loader/loading-overlay';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {getChartData, cleanChartData} from './reducer';

const DEFAULT_OPTIONS = {
  alignLabels: true,
  localization: {
    priceFormatter: (price: number) => formatPrice(price)
  },
  crosshair: { mode: CrosshairMode.Normal },
  handleScroll: false,
  handleScale: false,
};
const CANDLE_OPTIONS = {
  scaleMargins: {
    top: 0,
    bottom: 0.1,
  },
}

const HISTO_OPTIONS = {
  overlay: 'histo',
  scaleMargins: {
    top: 0.9,
    bottom: 0,
  },
  priceLineVisible: false,
  lastValueVisible: false
}

const DARK_THEME = {
  layout: {
    backgroundColor: '#253248',
    textColor: 'rgba(255, 255, 255, 0.9)',
  },
  grid: {
    vertLines: {
      color: '#334158',
    },
    horzLines: {
      color: '#334158',
    },
  },
  priceScale: {
    borderColor: '#485c7b',
  },
  timeScale: {
    borderColor: '#485c7b',
    lockVisibleTimeRangeOnResize: true,
  },
}

const LIGHT_THEME = {
  timeScale: {
    lockVisibleTimeRangeOnResize: true
  },
}

export const SingleToken = () => {
  const dispatch = useAppDispatch();
  const {address} = useParams<{address: string}>();
  const tokenData = useAppSelector(({tokensDataSlice: {dataByAddress}}) => dataByAddress[address]);
  const chartData = useAppSelector(({singleTokenSlice: {chartData}}) => chartData);
  const {theme} = useTheme();

  const [candlestickSeries, setCandlestickSeries] = useState<any>();
  const [histogramSeries, setHistogramSeries] = useState<any>();
  const [from, setFrom] = useState<any>();
  const [to, setTo] = useState<any>();

  useEffect(() => {
    if (chartData?.length) {
      setCandlestickSeries([{data: chartData, legend: "Price", options: CANDLE_OPTIONS}]);
      setHistogramSeries([{data: chartData, legend: "Volume", options: HISTO_OPTIONS}]);
      setFrom(chartData[0].time);
      setTo(chartData[chartData.length - 1].time);
    }
  }, [chartData]);

  useEffect(() => {
    dispatch(getChartData(address));

    return () => {
      dispatch(cleanChartData());
    }
  }, [dispatch, address]);

  return candlestickSeries ? (
    <>
      <Chart
        options={{...DEFAULT_OPTIONS, ...(theme === THEMES.DARK ? DARK_THEME : LIGHT_THEME)}}
        from={from}
        to={to}
        candlestickSeries={candlestickSeries}
        histogramSeries={histogramSeries}
        autoWidth
        autoHeight
        {...(theme === THEMES.DARK && {darkTheme: true})}
      />
    </>
  ) : <LoadingOverlay/>;
}
