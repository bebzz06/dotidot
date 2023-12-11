import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Loading from "./Loading";

describe("Loading", () => {
  it("renders loading state", () => {
    render(<Loading />);
    expect(screen.getByTestId("loading-container")).toHaveTextContent(
      "Loading..."
    );
  });
});
