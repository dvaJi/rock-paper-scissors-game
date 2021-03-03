import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { Rule } from "./types";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

interface RulesState {
  rules: Rule[];
  movements: string[];
  isLoading: boolean;
}

const initialState: RulesState = {
  rules: [],
  movements: [],
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
      state.movements = [...new Set(action.payload.map((r) => r.name))];
    });

    builder.addCase(createNewRule.fulfilled, (state, action) => {
      state.rules = [...state.rules, action.payload];
      state.movements = [
        ...new Set([...state.rules, action.payload].map((r) => r.name)),
      ];
    });

    builder.addCase(deleteRule.fulfilled, (state, action) => {
      state.rules = state.rules.filter((r) => r.id !== action.payload.id);
      state.movements = [
        ...new Set(
          state.rules
            .filter((r) => r.id !== action.payload.id)
            .map((r) => r.name)
        ),
      ];
    });
  },
});

export const selectRules = (state: RootState) => state.rules.rules;
export const selectRulesName = (state: RootState) => state.rules.movements;
export const selectIsLoading = (state: RootState) => state.rules.isLoading;

export default rulesSlice.reducer;
