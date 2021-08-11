import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type IntervalData = {
  open: number;
  high: number;
  low: number;
  close: number;
  time: number;
  value: number;
  trades: number;
};
type ChartData = IntervalData[];

type State = {
  loading: boolean;
  chartData: ChartData | null;
};

const initialState: State = {
  loading: true,
  chartData: null,
};

export const getChartData = createAsyncThunk(
  "chartData/getChartData",
  async (tokenAddress: string) => {
    const dataResponse = await fetch(
      `${process.env.REACT_APP_API_ROOT}/chart/${tokenAddress}`
    );
    const chartData = await dataResponse.json();

    return chartData;
  }
);

const singleTokenSlice = createSlice({
  name: "chartData",
  initialState,
  reducers: {
    cleanChartData(state) {
      state.loading = true;
      state.chartData = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChartData.fulfilled, (state, action) => {
      state.chartData = action.payload;
      state.loading = false;
    });
  },
});

const { reducer, actions } = singleTokenSlice;
export const { cleanChartData } = actions;
export default reducer;
