import { ethers } from 'ethers';
import { QUOTE_CURRENCY, EXCHANGE, INIT_CODE_HASH } from './constants';

export const sortsBefore = (tokenA: string, tokenB: string) => {
  return tokenA.toLowerCase() < tokenB.toLowerCase();
};

export const sortAddresses = (tokenA: string, tokenB: string) =>
  sortsBefore(tokenA, tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

export const getPairAddress = (tokenA: string, tokenB: string) => {
  const [token0, token1] = sortAddresses(tokenA, tokenB);

  return ethers.utils
    .getCreate2Address(
      EXCHANGE,
      ethers.utils.solidityKeccak256(['address', 'address'], [token0, token1]),
      INIT_CODE_HASH
    )
    .toLowerCase();
};

export const getQuotePairAddress = (tokenAddress: string) =>
  getPairAddress(tokenAddress, QUOTE_CURRENCY);

export const getPriceInUSD = (
  usdPriceInQuote: number,
  tokenPriceInQuote: number
) => (1 / usdPriceInQuote) * tokenPriceInQuote;
