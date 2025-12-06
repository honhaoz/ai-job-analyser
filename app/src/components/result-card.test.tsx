import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultCard } from "./result-card";

describe("ResultCard", () => {
  let writeTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();

    writeTextMock = vi
      .fn<(data: string) => Promise<void>>()
      .mockResolvedValue(undefined);

    vi.spyOn(navigator.clipboard, "writeText").mockImplementation(
      writeTextMock as (data: string) => Promise<void>
    );
  });

  it("should render null when content is null", () => {
    const { container } = render(
      <ResultCard title="Test Title" type="skills" content={null} />
    );
    expect(container.firstChild).toBe(null);
  });

  it("should render skills type with array content", () => {
    const skills = ["JavaScript", "TypeScript", "React"];
    render(<ResultCard title="Hard Skills" type="skills" content={skills} />);

    expect(screen.getByText("Hard Skills")).toBeInTheDocument();
    skills.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it("should render tips type with array content", () => {
    const tips = ["Tip 1: Do this", "Tip 2: Do that"];
    render(
      <ResultCard title="Resume Improvements" type="tips" content={tips} />
    );

    expect(screen.getByText("Resume Improvements")).toBeInTheDocument();
    tips.forEach((tip) => {
      expect(screen.getByText(tip)).toBeInTheDocument();
    });
  });

  it("should render text type with string content", () => {
    const text = "This is a cover letter snippet";
    render(<ResultCard title="Cover Letter" type="text" content={text} />);

    expect(screen.getByText("Cover Letter")).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("should update button icon when copied", async () => {
    const user = userEvent.setup();
    const skills = ["JavaScript"];

    render(<ResultCard title="Skills" type="skills" content={skills} />);

    const copyButton = screen.getByRole("button", {
      name: /copy to clipboard/i,
    });

    await user.click(copyButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /copied to clipboard/i,
        })
      ).toBeInTheDocument();
    });
  });
});
