import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { Rule } from "./types";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

interface RulesState {
  rules: Rule[];
  isLoading: boolean;
}

const initialState: RulesState = {
  rules: [],
  isLoading: true,
};

export const fetchRules = createAsyncThunk("rules/fetch", async () => {
  const response = await fetch(`${API_URL}/api/rules/`);
  return (await response.json()) as Rule[];
});

export const createNewRule = createAsyncThunk(
  "match/rule/create",
  async (rule: Omit<Rule, "id">) => {
    const response = await fetch(`${API_URL}/api/rules`, {
      method: "put",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify(rule),
    });
    return (await response.json()) as Rule;
  }
);

export const deleteRule = createAsyncThunk(
  "rules/delete",
  async (id: number) => {
    const response = await fetch(`${API_URL}/api/rules/${id}`, {
      method: "DELETE",
    });
    return (await response.json()) as Rule;
  }
);

export const rulesSlice = createSlice({
  name: "rules",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRules.fulfilled, (state, action) => {
      state.rules = action.payload;
      state.isLoading = false;
    });

    builder.addCase(createNewRule.fulfilled, (state, action) => {
      state.rules = [...state.rules, action.payload];
    });

    builder.addCase(deleteRule.fulfilled, (state, action) => {
      state.rules = state.rules.filter((r) => r.id !== action.payload.id);
    });
  },
});

export const selectRules = (state: RootState) => state.rules.rules;
export const selectRulesName = (state: RootState) => [
  ...new Set(state.rules.rules.map((r) => r.name)),
];
export const selectIsLoading = (state: RootState) => state.rules.isLoading;

export default rulesSlice.reducer;
