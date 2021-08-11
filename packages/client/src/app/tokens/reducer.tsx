import {createSlice} from '@reduxjs/toolkit';

export type TokenData = {
  tokenAddress: string,
  tokenName: string,
  tokenSymbol: string,
  launch: number,
  decimals: number,
  liquidity: number,
  volume: number,
  delta: number,
  close: number,
  minute15: number,
  hour1: number,
  hour4: number,
  day1: number,
  week1: number,
  price: number,
  creatorLiquidity: number
}
export type TokensData = TokenData[];
export type DataByAddress = Record<string, TokenData>

type State = {
  data: TokensData,
  dataByAddress: DataByAddress,
  loading: boolean
}

const initialState: State = {
  data: [],
  dataByAddress: {},
  loading: true
};

const tokensDataSlice = createSlice({
  name: 'tokensDataSlice',
  initialState,
  reducers: {
    tokensDataLoading(state) {
      if (!state.loading) {
        state.loading = true;
      }
    },
    tokensDataLoaded(state, action) {
      if (state.loading) {
        state.loading = false;
        state.data = action.payload;
        state.dataByAddress = action.payload.reduce((acc: DataByAddress, curr: TokenData) => {
          acc[curr.tokenAddress] = curr;
          return acc;
        }, {});
      }
    }
  }
});

const { actions, reducer } = tokensDataSlice;
export const {tokensDataLoading, tokensDataLoaded} = actions;
export default reducer
