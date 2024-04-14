import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";

jest.mock("axios");

test("renders App component", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const inputElement = screen.getByPlaceholderText("Enter GitHub Repo URL");
  expect(inputElement).toBeInTheDocument();
});

test("fetches issues when Load issues button is clicked", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const inputElement = screen.getByPlaceholderText("Enter GitHub Repo URL");
  const buttonElement = screen.getByRole("button", { name: /load issues/i });

  fireEvent.change(inputElement, {
    target: { value: "https://github.com/example/repo" },
  });
  fireEvent.click(buttonElement);

  expect(inputElement).toHaveValue("https://github.com/example/repo");
});

test("updates input value when changed", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const inputElement = screen.getByPlaceholderText("Enter GitHub Repo URL");

  fireEvent.change(inputElement, {
    target: { value: "https://github.com/example/repo" },
  });

  expect(inputElement).toHaveValue("https://github.com/example/repo");
});
