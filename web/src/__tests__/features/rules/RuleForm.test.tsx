import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import RuleForm from "@features/rules/RuleForm";
import rulesReducer from "@features/rules/rulesSlice";

const mockStore = configureStore({
  reducer: {
    rules: rulesReducer,
  },
});

test("renders form title", () => {
  render(
    <MemoryRouter>
      <Provider store={mockStore}>
        <RuleForm />
      </Provider>
    </MemoryRouter>
  );
  const linkElement = screen.getByText(/Create new rule/i);
  expect(linkElement).toBeInTheDocument();
});
