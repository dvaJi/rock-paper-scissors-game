import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import CreateMatch from "@features/match/CreateMatch";
import matchReducer from "@features/match/matchSlice";
import rulesReducer from "@features/rules/rulesSlice";

const mockStore = configureStore({
  reducer: {
    match: matchReducer,
    rules: rulesReducer,
  },
});

describe("CreateMatch", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <CreateMatch />
        </Provider>
      </MemoryRouter>
    );
  });

  it("renders form title", () => {
    const linkElement = screen.getByText(/Enter Player's Names/i);
    expect(linkElement).toBeInTheDocument();
  });

  it("should display required error when value is invalid", async () => {
    fireEvent.submit(screen.getByText("Start"));

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
  });

  it("should not display error when value is valid", async () => {
    fireEvent.input(screen.getByTestId("playerOne"), {
      target: {
        value: "Pedro",
      },
    });

    fireEvent.input(screen.getByTestId("playerTwo"), {
      target: {
        value: "Juan",
      },
    });

    fireEvent.submit(screen.getByText("Start"));

    await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
  });
});
