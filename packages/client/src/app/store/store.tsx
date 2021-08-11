import { configureStore } from "@reduxjs/toolkit";
import tokensDataSlice from "../tokens/reducer";
import singleTokenSlice from "../single-token/reducer";

export const store = configureStore({
  reducer: {
    tokensDataSlice,
    singleTokenSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
