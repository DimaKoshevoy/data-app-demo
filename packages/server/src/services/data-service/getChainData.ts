import {ethers, BigNumber} from 'ethers';
import {Contract, Provider} from 'ethers-multicall';
import {QUOTE_CURRENCY} from './constants';
import {sortsBefore} from './utils';

type TokenData = {
  tokenAddress: string,
  pairAddress: string,
  liquidityCreator: string
};
type LiquidityData = {
  [index:string]: {
    quoteReserve: BigNumber,
    tokenReserve: BigNumber,
    creatorBalance: BigNumber | null
  }
};

const RPC_URL = process.env.RPC_URL;

export const getTokenPoolLiquidity = async (tokens: TokenData[]): Promise<LiquidityData> => {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const ethcallProvider = new Provider(provider, 1);

  const reservesCalls = tokens.map(({pairAddress}) => {
    const poolContract = new Contract(
      pairAddress,
      ['function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)']
    );

    return poolContract.getReserves();
  });

  const tokensWithLiquidityInfo = tokens.filter(({liquidityCreator}) => !!liquidityCreator);
  const balanceCalls = tokensWithLiquidityInfo.map(({pairAddress, liquidityCreator}) => {
    const poolContract = new Contract(
      pairAddress,
      ['function balanceOf(address owner) external view returns (uint)']
    );

    return poolContract.balanceOf(liquidityCreator);
  });
  const lpTotalSupplyCalls = tokensWithLiquidityInfo.map(({pairAddress}) => {
    const poolContract = new Contract(
      pairAddress,
      ['function totalSupply() external view returns (uint)']
    );

    return poolContract.totalSupply();
  });
  // const totalSupplyCalls = tokens.map(({tokenAddress}) => {
  //   const tokenContract = new Contract(
  //     tokenAddress,
  //     ['function totalSupply() external view returns (uint)']
  //   );
  //
  //   return tokenContract.totalSupply();
  // });

  const [reserves, creatorBalances, lpTotalSupply] = await Promise.all([
    ethcallProvider.all(reservesCalls),
    ethcallProvider.all(balanceCalls),
    ethcallProvider.all(lpTotalSupplyCalls)
  ]);

  const creatorBalancesForTokenWithInfo = tokensWithLiquidityInfo.reduce((acc: any, {tokenAddress}: any, index) => {
    acc[tokenAddress] = {
      creatorBalance: creatorBalances[index],
      pairTotalSupply: lpTotalSupply[index],
    };
    return acc;
  }, {});

  return tokens.reduce((acc: LiquidityData, {tokenAddress}, index) => {
    const [quoteIndex, tokenIndex] = sortsBefore(tokenAddress, QUOTE_CURRENCY) ? [1, 0] : [0, 1];
    acc[tokenAddress] = {
      quoteReserve: reserves[index][quoteIndex],
      tokenReserve: reserves[index][tokenIndex],
      ...creatorBalancesForTokenWithInfo[tokenAddress]
    };
    return acc;
  }, {});
};
