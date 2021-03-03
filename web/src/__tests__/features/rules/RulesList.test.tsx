import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import RulesList from "@features/rules/RulesList";
import rulesReducer from "@features/rules/rulesSlice";

const mockStore = configureStore({
  reducer: {
    rules: rulesReducer,
  },
});

const rules = [
  { id: 1, name: "Rock", kills: "Scissors" },
  { id: 2, name: "Scissors", kills: "Paper" },
];

test("renders form title", () => {
  render(
    <Provider store={mockStore}>
      <RulesList rules={rules} />
    </Provider>
  );
  const linkElement = screen.getByText(/Rock/i);
  expect(linkElement).toBeInTheDocument();
});
