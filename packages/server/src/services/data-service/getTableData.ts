import {ethers} from 'ethers';
import {TIME_INTERVALS, TIME_INTERVALS_DATA, USDC, DAI} from './constants';
import {getPriceInUSD} from './utils';


const getTimePrice = (interval: string, token: any, usd: any) => {
  const tokenPriceInQuote = Number(token[interval]?.open_price);
  const usdPriceInQuote = Number(usd[interval]?.open_price);

  return getPriceInUSD(usdPriceInQuote, tokenPriceInQuote);
};

const getDataUSD = (data: any) => {
  const reference = data.find(({tokenAddress}: any) => tokenAddress === USDC || tokenAddress === DAI);
  const {quoteReserve, tokenReserve, decimals} = reference;
  const priceInQuote = Number(ethers.utils.formatEther(quoteReserve.toString())) / Number(ethers.utils.formatUnits(tokenReserve.toString(), decimals));

  return {
    ...reference,
    usdPrice: priceInQuote,
    ethPrice: 1 / priceInQuote
  }
}

export const getTableData = (data: any) => {
  const USD = getDataUSD(data);

  const tableData = data.flatMap((tokenVolumeData: any) => {
    const {
      tokenAddress, name, symbol, decimals, timestamp,
      quoteReserve, tokenReserve, creatorBalance, pairTotalSupply, totalSupply,
      tradeAmount
    } = tokenVolumeData;
    const largestIntervalData =
      tokenVolumeData[TIME_INTERVALS.WEEK_1] ||
      tokenVolumeData[TIME_INTERVALS.DAY_1] ||
      tokenVolumeData[TIME_INTERVALS.HOUR_4] ||
      tokenVolumeData[TIME_INTERVALS.HOUR_1] ||
      tokenVolumeData[TIME_INTERVALS.MINUTE_15] ||
      tokenVolumeData;

    // const volume = buyAmount + sellAmount;
    const delta = largestIntervalData.buyAmount / largestIntervalData.sellAmount;

    const sinceLaunched = timestamp ? (Math.floor(Date.now() / 1000) - timestamp) * 1000 : 0;
    const week1 =  sinceLaunched > TIME_INTERVALS_DATA.DAY_1.value ? getTimePrice(TIME_INTERVALS.WEEK_1, tokenVolumeData, USD) : null;
    const day1 =  sinceLaunched > TIME_INTERVALS_DATA.HOUR_4.value ? getTimePrice(TIME_INTERVALS.DAY_1, tokenVolumeData, USD) : null;
    const hour4 =  sinceLaunched > TIME_INTERVALS_DATA.HOUR_1.value ? getTimePrice(TIME_INTERVALS.HOUR_4, tokenVolumeData, USD) : null;
    const hour1 =  sinceLaunched > TIME_INTERVALS_DATA.MINUTE_15.value ? getTimePrice(TIME_INTERVALS.HOUR_1, tokenVolumeData, USD) : null;
    const minute15 =  sinceLaunched > TIME_INTERVALS_DATA.MINUTE_15.value ? getTimePrice(TIME_INTERVALS.MINUTE_15, tokenVolumeData, USD) : null;

    const currentPrice = Number(ethers.utils.formatEther(quoteReserve.toString())) / Number(ethers.utils.formatUnits(tokenReserve.toString(), decimals));
    const currentPriceInUSD = getPriceInUSD(USD.usdPrice, currentPrice);
    // const marketCap = currentPriceInUSD * Number(ethers.utils.formatUnits(totalSupply.toString(), decimals));

    const creatorLiquidity = creatorBalance
      ? (Number(ethers.utils.formatEther(creatorBalance.toString())) / Number(ethers.utils.formatEther(pairTotalSupply.toString()))) * 100
      : null;

    return [{
      tokenAddress,
      tokenName: name,
      tokenSymbol: symbol,
      decimals,
      launch: timestamp,
      liquidity: Number(ethers.utils.formatEther(quoteReserve.toString())),
      volume: tradeAmount,
      delta,
      open: getPriceInUSD(USD.usdPrice, Number(largestIntervalData.open_price)),
      high: getPriceInUSD(USD.usdPrice, largestIntervalData.high_price),
      low: getPriceInUSD(USD.usdPrice, largestIntervalData.low_price),
      close: getPriceInUSD(USD.usdPrice, Number(largestIntervalData.close_price)),
      minute15,
      hour1,
      hour4,
      day1,
      week1,
      takers: largestIntervalData.takers,
      senders: largestIntervalData.senders,
      price: currentPriceInUSD,
      creatorLiquidity
    }];
  });

  return tableData;
}
