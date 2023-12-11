import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("renders default error state", () => {
    render(<ErrorMessage message="" />);
    expect(screen.getByTestId("message-container")).toBeVisible();
  });
});
