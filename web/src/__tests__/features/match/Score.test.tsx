import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Score from "@features/match/Score";
import matchReducer from "@features/match/matchSlice";

const mockStore = configureStore({
  reducer: {
    match: matchReducer,
  },
});

test("renders form title", () => {
  render(
    <MemoryRouter>
      <Provider store={mockStore}>
        <Score />
      </Provider>
    </MemoryRouter>
  );
  const linkElement = screen.getByText(/Score/i);
  expect(linkElement).toBeInTheDocument();
});
