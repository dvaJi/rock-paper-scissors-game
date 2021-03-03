import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import matchReducer from "./features/match/matchSlice";
import rulesReducer from "./features/rules/rulesSlice";

export const store = configureStore({
  reducer: {
    match: matchReducer,
    rules: rulesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
