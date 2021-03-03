import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Match from "@features/match/Match";
import matchReducer from "@features/match/matchSlice";
import rulesReducer from "@features/rules/rulesSlice";

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
        <Match />
      </Provider>
    </MemoryRouter>
  );
  const linkElement = screen.getByText(/Round 1/i);
  expect(linkElement).toBeInTheDocument();
});
