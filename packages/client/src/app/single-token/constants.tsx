import { formatPrice } from '../utils';
import { CrosshairMode } from 'lightweight-charts';

export const DEFAULT_OPTIONS = {
  alignLabels: true,
  localization: {
    priceFormatter: (price: number) => formatPrice(price),
  },
  crosshair: { mode: CrosshairMode.Normal },
  handleScroll: false,
  handleScale: false,
};
export const CANDLE_OPTIONS = {
  scaleMargins: {
    top: 0,
    bottom: 0.1,
  },
};

export const HISTO_OPTIONS = {
  overlay: 'histo',
  scaleMargins: {
    top: 0.9,
    bottom: 0,
  },
  priceLineVisible: false,
  lastValueVisible: false,
};

export const DARK_THEME = {
  layout: {
    backgroundColor: '#1F2937',
    textColor: '#D1D5DB',
  },
  grid: {
    vertLines: {
      color: '#374151',
    },
    horzLines: {
      color: '#374151',
    },
  },
  priceScale: {
    borderColor: '#4B5563',
  },
  timeScale: {
    borderColor: '#4B5563',
    lockVisibleTimeRangeOnResize: true,
  },
};

export const LIGHT_THEME = {
  layout: {
    backgroundColor: '#FFF',
    textColor: '#4B5563',
  },
  grid: {
    vertLines: {
      color: '#E5E7EB',
    },
    horzLines: {
      color: '#E5E7EB',
    },
  },
  priceScale: {
    borderColor: '#D1D5DB',
  },
  timeScale: {
    borderColor: '#D1D5DB',
    lockVisibleTimeRangeOnResize: true,
  },
};
