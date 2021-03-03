import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "../App";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import matchReducer from "../features/match/matchSlice";
import rulesReducer from "../features/rules/rulesSlice";

const mockStore = configureStore({
  reducer: {
    match: matchReducer,
    rules: rulesReducer,
  },
});

test("renders form title", () => {
  render(
    <MemoryRouter>
      <Provider store={mockStore}>
        <App />
      </Provider>
    </MemoryRouter>
  );
  const linkElement = screen.getByText(/Enter Player's Names/i);
  expect(linkElement).toBeInTheDocument();
});
