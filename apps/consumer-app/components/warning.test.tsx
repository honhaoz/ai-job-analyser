import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Warning } from "./warning";

describe("Warning component", () => {
  it("renders the provided message", () => {
    render(<Warning message={<span>Do not share sensitive data</span>} />);

    expect(
      screen.getByText(/do not share sensitive data/i),
    ).toBeInTheDocument();
  });

  it("shows a warning indicator and applies styling classes", () => {
    render(<Warning message={<span>Watch out</span>} />);

    expect(screen.getByText("⚠️")).toBeInTheDocument();

    const container = screen.getByText(/watch out/i);
    expect(container).not.toBeNull();
    const outer = container?.closest(
      "div.bg-amber-50.border-l-4.border-amber-400.p-4.mb-6.rounded-r-lg",
    );
    expect(outer).not.toBeNull();
  });

  it("has proper ARIA attributes for accessibility", () => {
    render(<Warning message={<span>Important warning</span>} />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
  });
});
