import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import {
  CreateMatchResponse,
  FetchMatchResponse,
  PushRound,
  Round,
  RoundResponse,
} from "./types";

const API_URL = process.env.REACT_APP_API_ENDPOINT;

interface MatchState {
  id?: number;
  playerOne?: string;
  playerTwo?: string;
  currentRound: number;
  rounds: Round[];
  winner?: string;
}

export const fetchMatch = createAsyncThunk(
  "match/fetch",
  async (id: number) => {
    const response = await fetch(`${API_URL}/api/match/${id}`);
    return (await response.json()) as FetchMatchResponse;
  }
);

export const createNewMatch = createAsyncThunk(
  "match/create",
  async (newMatch: { playerOne: string; playerTwo: string }) => {
    const response = await fetch(`${API_URL}/api/match`, {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify(newMatch),
    });
    return (await response.json()) as CreateMatchResponse;
  }
);

export const pushRound = createAsyncThunk(
  "round/create",
  async (data: PushRound) => {
    const response = await fetch(`${API_URL}/api/round`, {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify(data),
    });
    return (await response.json()) as RoundResponse;
  }
);

const initialState: MatchState = {
  currentRound: 1,
  rounds: [],
};

export const matchSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    clearMatch: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder.addCase(createNewMatch.fulfilled, (state, { payload }) => {
      state.id = payload.id;
      state.playerOne = payload.playerOne.name;
      state.playerTwo = payload.playerTwo.name;
    });

    builder.addCase(fetchMatch.fulfilled, (state, { payload }) => {
      state.id = payload.id;
      state.playerOne = payload.playerOne.name;
      state.playerTwo = payload.playerTwo.name;

      if (payload.rounds) {
        state.rounds = payload.rounds;
        state.currentRound = payload.rounds.length + 1;
      }

      if (payload.winner) {
        state.winner = payload.winner.name;
      }
    });

    builder.addCase(pushRound.fulfilled, (state, { payload }) => {
      if (payload.winner !== "TIE") {
        state.rounds.push(payload);
        state.currentRound = state.currentRound + 1;
      }

      if (payload.matchWinner) {
        state.winner = payload.matchWinner;
      }
    });

    // builder.addCase(deleteRule.fulfilled, (state, action) => {
    //   state.rules = state.rules.filter((r) => r.id !== action.payload.id);
    // });
  },
});

// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectMatch = (state: RootState) => state.match;
export const selectRounds = (state: RootState) => state.match.rounds;
export const { clearMatch } = matchSlice.actions;

export default matchSlice.reducer;
